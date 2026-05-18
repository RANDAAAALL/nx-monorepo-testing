const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../apps/api/.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    'Please add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY directly into apps/api/.env before running.',
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const usersJsonPath = path.join(__dirname, '../apps/api/data/users.json');

async function migrate() {
  if (!fs.existsSync(usersJsonPath)) {
    console.log('No users.json found. Skipping migration.');
    process.exit(0);
  }

  const users = JSON.parse(fs.readFileSync(usersJsonPath, 'utf8'));
  console.log(`Found ${users.length} users to migrate.`);

  for (const u of users) {
    const password_hash = bcrypt.hashSync(u.password, 10);
    const { error } = await supabase
      .from('users')
      .upsert({ id: u.id, username: u.username, password_hash });

    if (error) {
      console.error(`Error migrating user ${u.username}:`, error.message);
    } else {
      console.log(`Migrated user: ${u.username}`);
    }
  }

  console.log('Migration complete!');
}

migrate();
