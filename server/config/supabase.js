const { createClient } = require("@supabase/supabase-js");

console.log("ENV URL =", process.env.SUPABASE_URL);
console.log("ENV KEY =", process.env.SUPABASE_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;