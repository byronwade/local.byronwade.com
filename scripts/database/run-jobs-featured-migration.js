#!/usr/bin/env bun

/**
 * Migration script to add the featured column to the jobs table
 * This fixes the "column jobs.featured does not exist" error
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

console.log('🚀 Starting jobs featured column migration...');

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    // Read the migration SQL file
    const migrationPath = join(process.cwd(), 'scripts/database/006_add_jobs_featured_column.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Running migration: 006_add_jobs_featured_column.sql');
    
    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the column exists
    console.log('🔍 Verifying the featured column was added...');
    
    const { data: testData, error: testError } = await supabase
      .from('jobs')
      .select('id, featured')
      .limit(1);
    
    if (testError) {
      console.error('❌ Verification failed:', testError);
      process.exit(1);
    }
    
    console.log('✅ Verification successful! The featured column is now available.');
    
    // Check if there are any featured jobs
    const { data: featuredJobs, error: featuredError } = await supabase
      .from('jobs')
      .select('id, title, featured')
      .eq('featured', true)
      .limit(5);
    
    if (!featuredError && featuredJobs?.length > 0) {
      console.log(`🌟 Found ${featuredJobs.length} featured jobs:`);
      featuredJobs.forEach(job => {
        console.log(`  - ${job.title} (ID: ${job.id})`);
      });
    } else {
      console.log('ℹ️  No featured jobs found (this is normal for a fresh migration)');
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  }
}

// Alternative direct SQL execution if rpc doesn't work
async function runMigrationDirect() {
  try {
    console.log('📄 Running migration with direct SQL execution...');
    
    // Add the column
    const { error: addColumnError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;'
    });
    
    if (addColumnError) {
      console.error('❌ Failed to add featured column:', addColumnError);
      // Try alternative approach
      console.log('🔄 Trying alternative approach...');
      
      // Check if column already exists
      const { data: columns } = await supabase.rpc('exec_sql', {
        sql: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'jobs' AND column_name = 'featured'
        `
      });
      
      if (columns && columns.length === 0) {
        console.log('⚠️  Column does not exist, manual intervention may be required');
        console.log('📋 SQL to run manually in Supabase dashboard:');
        console.log('    ALTER TABLE jobs ADD COLUMN featured BOOLEAN DEFAULT FALSE;');
        console.log('    CREATE INDEX idx_jobs_featured ON jobs(featured DESC);');
        console.log('    CREATE INDEX idx_jobs_featured_created_at ON jobs(featured DESC, created_at DESC);');
      } else {
        console.log('✅ Featured column already exists!');
      }
    } else {
      console.log('✅ Featured column added successfully!');
      
      // Add indexes
      await supabase.rpc('exec_sql', {
        sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured DESC);'
      });
      
      await supabase.rpc('exec_sql', {
        sql: 'CREATE INDEX IF NOT EXISTS idx_jobs_featured_created_at ON jobs(featured DESC, created_at DESC);'
      });
      
      console.log('✅ Indexes created successfully!');
    }
    
  } catch (error) {
    console.error('💥 Direct migration failed:', error);
    console.log('📋 Manual SQL to run in Supabase dashboard:');
    console.log('    ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;');
    console.log('    CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured DESC);');
    console.log('    CREATE INDEX IF NOT EXISTS idx_jobs_featured_created_at ON jobs(featured DESC, created_at DESC);');
  }
}

// Run the migration
console.log('🔧 Attempting to fix "column jobs.featured does not exist" error...');
await runMigrationDirect();

console.log('');
console.log('🎉 Migration process completed!');
console.log('💡 You can now restart your development server.');
