# Contributing to Pathwise

Thanks for your interest in Pathwise.

## Development

Follow the local setup instructions in the root [README](README.md). Run the frontend and backend in separate terminals.

## Working on changes

1. Create a branch for your change.
2. Keep frontend API calls in `frontend/src/services/api.js`.
3. Keep route handlers in `backend/app/routes/`.
4. Keep business logic in `backend/app/services/`.
5. Keep request and response schemas in `backend/app/schemas.py`.
6. Update documentation when an endpoint, schema, environment variable or feature changes.
7. Test affected flows locally before opening a pull request.

## Security

- Never commit `.env` files, API keys, tokens, database credentials or real student information.
- Do not put backend secrets in frontend variables beginning with `VITE_`.
- If a credential is exposed, revoke or rotate it immediately.

## Pull requests

Describe the problem, the change, how it was tested and any known limitations. Include screenshots for UI changes where practical.
