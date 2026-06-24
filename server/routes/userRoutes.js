const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const genAI = require("../config/gemini");
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword }]);

    if (error) {
      return res.status(500).json({
        error: error.message
      });
    }

    res.json({
      message: "User added successfully",
      data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      data.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password"
      });
    }

    res.json({
      message: "Login successful"
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
router.post("/add-expense", async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          user_id,
          title,
          amount,
          category
        }
      ]);

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
router.delete("/expense/:id", async (req, res) => {
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