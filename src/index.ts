import chalk from 'chalk';
import { exec } from 'child_process';
import * as process from 'process';
import terminalSize from 'terminal-size';
import * as util from 'util';
import { getContextForConfig } from './context';
import { getGitConfig } from './getGitConfig';
import { transformContentsStreaming } from './transformContentsStreaming';
import { getConfig } from './getConfig';
const execAsync = util.promisify(exec);

async function main() {
    const { stdout: gitConfigString } = await execAsync('git config -l');
    const gitConfig = getGitConfig(gitConfigString);
    const config = getConfig(gitConfig);
    // get columns from the env if available
    const envColumns = process.env['COLUMNS'];
    const columns = envColumns ? parseInt(envColumns) : undefined;
    const context = await getContextForConfig(
        config,
        chalk,
        columns || terminalSize().columns
    );
    await transformContentsStreaming(context, process.stdin, process.stdout);
}

main();
