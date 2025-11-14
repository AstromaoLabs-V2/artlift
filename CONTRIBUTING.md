## **Workflow**

1. **Pick an issue**:
   - Browse the [GitHub Issues](https://github.com/AstromaoLabs-V2/artlift/issues) for tasks.
   - Comment on the issue to indicate you're working on it.

2. **Create a new branch for your work**:
   - Use the following naming format:
     ```bash
     git checkout -b issue-#<issue-number>-<short-description>
     ```
     Example:
     ```bash
     git checkout -b issue-#5-add-login-page
     ```
     
3. **Work on your branch**:
   - Implement your changes.
   - Make small, meaningful commits:
     ```bash
     git add .
     git commit -m "Fix #<issue-number>: <commit-message>"
     ```
     Example:
     ```bash
     git commit -m "Fix #5: Add login page with form"
     ```

3. **Push your branch**:
   ```bash
   git push origin issue-#<issue-number>-<short-description>
   ```

---

## **Create a Pull Request (PR)**

1. Open a new PR on GitHub.
2. Fill out the required details in the PR template (this will appear automatically).
3. Link the PR to the issue by including `Fixes #<issue-number>` in the description.
4. Request reviewers and address any feedback.

You can find the PR template [here](.github/pull_request_template.md).

---

## **Best Practices**

- **Keep changes focused**: Address one issue per branch and PR.
- **Write meaningful commit messages**: Clearly describe your changes.
- **Test thoroughly**: Ensure all changes work as expected.
- **Follow code standards**: Adhere to the project's style and guidelines.
