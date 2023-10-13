# Fullstack Template Creation Action
A GitHub action that gets run when the fullstack-template repo is used to initialize a different repo. In some places I've worked, we clone from a template repository frequently. As part of that cloning process, we would spend ~1 hour each time renaming files to match the new repo name. This action will automatically do all that renaming, saving a lot of time.

## What does this action do?
The action does the following:
1. Renames the API folder to be the name of the repo (e.g. "animal-tracker-api" if the repo is named "animal-tracker")
2. Renames the frontend folder to be the name of the repo (e.g. "animal-tracker" if the repo is named "animal-tracker")
3. Renames all instances of `api-template-name` in the API folder to the name of the repo (e.g. "AnimalTracker" if the repo is named "animal-tracker")
4. Renames all instances of `frontend-template-name` in the frontend folder to the name of the repo (e.g. "Animal Tracker" if the repo is named "animal-tracker")

## Usage
To use this action, add the following to your workflow:
```yaml
- name: Fullstack Template Creation Action
  uses: byu-life-sciences/fullstack-template-creation-action@v1.0.0
  with:
    name-to-replace-with: ${{ github.repository }}
    api-template-name: CAP
    frontend-template-name: React DAB!
```
Where `api-template-name` is the name of the API template (e.g. "CAP") and `frontend-template-name` is the name of the frontend template (e.g. "React DAB!") you are trying to replace with the GitHub repo name.

## Compiling the action
To compile the action after changing the JS source file, run the following command:
```
npm i -g @vercel/ncc
ncc build index.js --license licenses.txt
```

## For more information
[Visit GitHub's official documentation on creating JS actions](https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action)


Author: [Andrew Peterson](https://github.com/andrewpeterson99) (for questions; or you can just change the code)
