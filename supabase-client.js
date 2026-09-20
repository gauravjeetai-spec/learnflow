// supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm.js';

export const supa = createClient(
  'https://zltqnsylerhcbnslqcqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsdHFuc3lsZXJoY2Juc2xxY3FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4OTUyNDAsImV4cCI6MjEwNTQ3MTI0MH0.dmMVf1ZFdBsvHtD2vfZRcKSqyjqsSkAwqlDUB5aUzZk'
);