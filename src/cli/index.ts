import { Command } from "commander";

const program = new Command();

program
  .name("secret-scanner")
  .description("Scan a project for accidentally committed secrets")
  .version("0.1.0");

program
  .command("scan <path>")
  .description("Scan a directory for secret leaks")
  .option("--json", "output results as JSON")
  .option("--verbose", "show extra detail for each finding")
  .option("--rules <path>", "path to custom rules file")
  .action((scanPath, options) => {
    console.log(`Scanning project at: ${scanPath}`);
  });

program.parse(process.argv);
