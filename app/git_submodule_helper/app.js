const selectorRepositoryAsSubmodule = document.getElementById('repo');
const selectorDirectoryToAddSubmoduleTo = document.getElementById('dir');
const selectorNewDirectoryNameForSubmodule = document.getElementById('submodule_dir_name');
const selectorResult = document.getElementById('result');
const selectorClone = document.getElementById('clone');

function doIt() {
    if (selectorRepositoryAsSubmodule.value) { // Important value
        const repo = selectorRepositoryAsSubmodule.value.match(/^[^\?#]*/)[0];
        const repoLast = repo.match(/[^\/]*$/)[0];
        const inputNewDir = selectorNewDirectoryNameForSubmodule.value;
        let dir = '';
        let newDir = '';

        if (selectorDirectoryToAddSubmoduleTo.value)
            dir = selectorDirectoryToAddSubmoduleTo.value.match(/(?!\/).*(?<!\/)/)[0] + '/';

        if (inputNewDir)
            newDir = inputNewDir;
        else if (repoLast)
            newDir = repoLast;

        selectorNewDirectoryNameForSubmodule.placeholder = repoLast;
        selectorResult.innerText = `git submodule add ${repo} ${dir}${newDir}`;
        selectorClone.innerText = `git clone --recursive ${repo}`;
    }
    else {
        selectorNewDirectoryNameForSubmodule.removeAttribute('placeholder');
        selectorResult.innerText = 'git submodule add [repository_url] [directory_for_submodule]';
        selectorClone.innerText = `git clone --recursive [url]`;
    }
}

selectorRepositoryAsSubmodule.addEventListener('input', doIt);
selectorDirectoryToAddSubmoduleTo.addEventListener('input', doIt);
selectorNewDirectoryNameForSubmodule.addEventListener('input', doIt);

doIt();