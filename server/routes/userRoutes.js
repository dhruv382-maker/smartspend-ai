const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const genAI = require("../config/gemini");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      return res.status(500).json({
        error: fetchError.message
      });
    }

    // ── Existing user: verify password and log in ──
    if (existingUser) {
      const isMatch = await bcrypt.compare(password, existingUser.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Wrong password"
        });
      }

      return res.json({
        message: "Login successful",
        user: existingUser
      });
    }

    // ── New user: auto-create account, then log in ──
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          name: "NewUser",
          email: email,
          password: hashedPassword
        }
      ])
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({
        error: insertError.message
      });
    }

    res.status(201).json({
      message: "Account created and logged in",
      user: newUser
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ── Add expense ──
// user_id now comes from Supabase Google OAuth and is a UUID/string.
// It is passed straight through to Supabase with no numeric coercion.
router.post("/add-expense", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || amount === null || !category) {
      return res.status(400).json({
        message: "user_id, title, amount and category are required"
      });
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          user_id: String(user_id),
          title,
          amount: Number(amount),
          category
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      message: "Expense added",
      data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ── Get expenses for a user ──
// userId is a Supabase UUID/string, used as-is in the query.
router.get("/expenses/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      expenses: data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ── Delete expense ──
// Route renamed to /delete-expense/:id to match the frontend's axios call.
router.delete("/delete-expense/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      message: "Expense deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ── Summary by category ──
// userId is a Supabase UUID/string, used as-is in the query.
router.get("/summary/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    let summary = {};

    data.forEach((expense) => {
      if (summary[expense.category]) {
        summary[expense.category] += expense.amount;
      } else {
        summary[expense.category] = expense.amount;
      }
    });

    res.json(summary);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// ── AI analysis ──
// userId is a Supabase UUID/string, used as-is in the query.
router.get("/analyze/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    const expenseText = JSON.stringify(data);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `
    Analyze these expenses and give saving advice:
    ${expenseText}
    `;

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    res.json({
      analysis: response
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;