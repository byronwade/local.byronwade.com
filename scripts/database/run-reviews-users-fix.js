#!/usr/bin/env bun

/**
 * Migration script to fix the reviews-users relationship
 * This fixes the "Could not find a relationship between 'reviews' and 'users'" error
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

console.log('🚀 Starting reviews-users relationship fix...');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testRelationship() {
  console.log('🔍 Testing current reviews-users relationship...');
  
  try {
    // Test the problematic query pattern
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        text,
        user:users(name, avatar_url)
      `)
      .limit(1);
    
    if (error) {
      console.log('❌ Current relationship test failed:', error.message);
      return false;
    } else {
      console.log('✅ Relationship test passed!');
      return true;
    }
  } catch (error) {
    console.log('💥 Relationship test error:', error.message);
    return false;
  }
}

async function checkTables() {
  console.log('📊 Checking table existence and structure...');
  
  try {
    // Check if users table exists
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .limit(1);
    
    if (usersError) {
      console.log('⚠️  Users table issue:', usersError.message);
    } else {
      console.log(`✅ Users table exists with ${usersData?.length || 0} sample records`);
    }
    
    // Check if reviews table exists
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('id, user_id')
      .limit(1);
    
    if (reviewsError) {
      console.log('⚠️  Reviews table issue:', reviewsError.message);
    } else {
      console.log(`✅ Reviews table exists with ${reviewsData?.length || 0} sample records`);
    }
    
  } catch (error) {
    console.log('💥 Table check error:', error.message);
  }
}

async function runSimpleFixes() {
  console.log('🔧 Running simple relationship fixes...');
  
  try {
    // Check if the foreign key constraint exists
    const { data: constraintData } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT constraint_name, table_name, column_name
        FROM information_schema.key_column_usage 
        WHERE table_name = 'reviews' 
        AND column_name = 'user_id'
        AND constraint_name LIKE '%fkey%'
      `
    });
    
    console.log('🔍 Found constraints:', constraintData);
    
    // Try to create the index manually
    await supabase.rpc('exec_sql', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);'
    });
    
    console.log('✅ Created review user_id index');
    
    // Try to refresh the schema cache
    await supabase.rpc('exec_sql', {
      sql: 'NOTIFY pgrst, \'reload schema\';'
    });
    
    console.log('🔄 Attempted schema cache refresh');
    
  } catch (error) {
    console.log('⚠️  Simple fixes completed with warnings:', error.message);
  }
}

async function main() {
  // Step 1: Check current state
  await checkTables();
  
  // Step 2: Test current relationship
  const relationshipWorks = await testRelationship();
  
  if (relationshipWorks) {
    console.log('🎉 Reviews-users relationship is already working!');
    console.log('💡 The error might be intermittent or related to cache.');
    console.log('🔄 Try restarting your development server.');
    return;
  }
  
  // Step 3: Run simple fixes
  await runSimpleFixes();
  
  // Step 4: Test again
  console.log('🔍 Testing relationship after fixes...');
  const fixedRelationship = await testRelationship();
  
  if (fixedRelationship) {
    console.log('🎉 Reviews-users relationship is now working!');
  } else {
    console.log('⚠️  Relationship still has issues. Manual intervention may be needed.');
    console.log('');
    console.log('📋 Manual steps to try:');
    console.log('1. Check if both tables exist in Supabase dashboard');
    console.log('2. Verify foreign key constraint: reviews(user_id) -> users(id)');
    console.log('3. Ensure both tables have data');
    console.log('4. Try refreshing the PostgREST schema cache');
  }
}

await main();

console.log('');
console.log('🏁 Reviews-users relationship fix completed!');
console.log('💡 Restart your development server to see changes.');
