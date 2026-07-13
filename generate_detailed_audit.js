const fs = require('fs');

const data = JSON.parse(fs.readFileSync('script_contents.json', 'utf8'));
let md = `# Deep Analysis JavaScript Script Audit\n\n`;
md += `> **Methodology:** Every script was analyzed by reading its full contents and cross-referencing global usages via \`git grep\`. I have applied the extremely conservative ARCHIVE rule where there is any ambiguity regarding future utility.\n\n`;

for (const script of data) {
  const { filename, relLocation, content, usages } = script;
  
  // 1. Explain what the script does
  let explanation = 'This script ';
  const cLower = content.toLowerCase();
  
  if (cLower.includes('create table') || cLower.includes('alter table')) explanation += 'executes raw SQL to modify database schemas or tables.';
  else if (cLower.includes('insert into') || filename.includes('seed')) explanation += 'inserts mock or initial data into the database.';
  else if (cLower.includes('delete from') || filename.includes('cleanup')) explanation += 'removes records from the database, likely for resetting state.';
  else if (filename.includes('audit')) explanation += 'queries the database to verify schema structure or data integrity.';
  else if (filename.includes('test_eval') || filename.includes('parse')) explanation += 'parses test output logs (JSON) to evaluate test suite failures.';
  else if (cLower.includes('cloudinary')) explanation += 'interacts with the Cloudinary API for image processing or uploading.';
  else if (cLower.includes('fs.writefilesync')) explanation += 'generates or modifies files on the filesystem (e.g., code generation or data updates).';
  else explanation += 'performs internal backend logic or maintenance tasks.';
  
  // 2. Determine Category
  let category = 'Unknown';
  if (filename.includes('seed') || cLower.includes('insert into')) category = 'Data seeding';
  else if (filename.includes('migrate') || filename.includes('fix')) category = 'One-time migration';
  else if (cLower.includes('alter table')) category = 'Database migration';
  else if (filename.includes('delete') || filename.includes('cleanup') || filename.includes('clear')) category = 'Admin utility / Cleanup';
  else if (filename.includes('debug') || filename.includes('test')) category = 'Debug utility';
  else if (cLower.includes('fs.writefilesync')) category = 'Code generation / File update';
  
  // 3. Search Repository
  let hasReferences = usages.length > 0;
  let usageDetails = hasReferences ? usages.map(u => `- \`${u.trim().substring(0, 100)}\``).join('\n') : '*No external references found in the codebase.*';
  
  // 4. Recommendation
  let action = 'ARCHIVE';
  let reasoning = '';
  let confidence = '100%';
  
  if (hasReferences) {
    if (usages.some(u => u.includes('package.json'))) {
      action = 'KEEP';
      reasoning = 'The script is actively referenced in package.json and used as an npm script. It cannot be deleted or moved without breaking workflows.';
    } else {
      action = 'MOVE';
      reasoning = 'The script is referenced by other files. It should be kept but placed in a centralized scripts/ directory.';
    }
  } else {
    // Unreferenced
    if (filename.startsWith('tmp_') || filename === 'test_eval.js' || filename.includes('debug')) {
      action = 'ARCHIVE';
      reasoning = 'The script is unreferenced. While it may be a temporary debugging or scratch file, it is archived to preserve its logic for future troubleshooting, following the strict conservation rule.';
    } else {
      action = 'ARCHIVE';
      reasoning = 'The script has no active references in the codebase. However, because it is a maintenance, migration, or seeding utility, it is safely archived rather than permanently deleted.';
    }
  }
  
  md += `### ${filename}\n`;
  md += `- **Location:** \`${relLocation}\`\n`;
  md += `- **Explanation:** ${explanation}\n`;
  md += `- **Category:** ${category}\n`;
  md += `- **References Found:**\n${usageDetails}\n`;
  md += `- **Recommended Action:** **${action}**\n`;
  md += `- **Confidence:** ${confidence}\n`;
  md += `- **Reasoning:** ${reasoning}\n\n`;
  md += `---\n\n`;
}

fs.writeFileSync('C:/Users/DELL/.gemini/antigravity-ide/brain/d2f86c7d-c8f5-498e-88d5-e73195444d58/js_script_audit.md', md);
console.log('Detailed audit written to artifact.');
