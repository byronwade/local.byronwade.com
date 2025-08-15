-- Add featured column to jobs table
-- This migration adds the missing 'featured' column that's being referenced in queries

-- Add the featured column to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- Create an index for better performance when ordering by featured
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON jobs(featured DESC);

-- Create a composite index for the common ordering pattern (featured, created_at)
CREATE INDEX IF NOT EXISTS idx_jobs_featured_created_at ON jobs(featured DESC, created_at DESC);

-- Update some existing jobs to be featured for testing purposes
-- (Optional: comment out if you don't want any initial featured jobs)
UPDATE jobs 
SET featured = TRUE 
WHERE status = 'published' 
  AND created_at >= NOW() - INTERVAL '30 days'
  AND id IN (
    SELECT id FROM jobs 
    WHERE status = 'published' 
    ORDER BY application_count DESC, view_count DESC 
    LIMIT 5
  );

-- Grant necessary permissions
GRANT ALL ON jobs TO authenticated;

-- Add comment for documentation
COMMENT ON COLUMN jobs.featured IS 'Whether this job should be featured/highlighted in search results and listings';
