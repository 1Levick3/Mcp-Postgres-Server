# Contributing to PostgreSQL MCP Server

Thank you for your interest in contributing to the PostgreSQL MCP Server project! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Code Style Guidelines](#code-style-guidelines)
5. [Testing](#testing)
6. [Documentation](#documentation)
7. [Pull Request Process](#pull-request-process)
8. [Security Considerations](#security-considerations)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others when contributing.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL server (for development and testing)
- Git

### Setting Up the Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/1Levick3/postgresql-mcp-server.git
   cd postgresql-mcp-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add necessary environment variables (see `.env.example`)

### Building the Project

```bash
npm run build
```

## Development Workflow

### Branch Naming Convention

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Performance improvements: `perf/description`
- Refactoring: `refactor/description`

### Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or modifying tests
- `chore`: Maintenance tasks

### Development Process

1. Create a new branch from `main`
2. Make your changes
3. Write or update tests
4. Run tests and linting
5. Commit your changes
6. Push to your fork
7. Create a Pull Request

## Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the project's ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use async/await for asynchronous operations
- Handle errors appropriately

### Database Access

- Use prepared statements for all queries
- Validate input parameters
- Handle connection errors gracefully
- Implement proper connection pooling
- Use transactions for multiple related operations
- Follow PostgreSQL best practices

## Testing

### Running Tests

```bash
npm test
```

### Test Coverage

```bash
npm run test:coverage
```

### Writing Tests

- Write tests for all new features
- Include both positive and negative test cases
- Mock external dependencies
- Use descriptive test names
- Follow the project's testing patterns

## Documentation

### Code Documentation

- Document all public APIs
- Include examples where helpful
- Keep documentation up to date
- Use JSDoc comments

### Project Documentation

- Update README.md for significant changes
- Document new features
- Keep installation instructions current
- Update configuration examples

## Pull Request Process

1. Ensure your branch is up to date with `main`
2. Run all tests and linting
3. Update documentation if needed
4. Create a detailed PR description
5. Reference any related issues
6. Request review from maintainers

### PR Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] Changes are properly tested
- [ ] Security considerations are addressed

## Security Considerations

### Database Security

- Never expose raw SQL to untrusted input
- Use parameterized queries
- Implement proper access controls
- Handle sensitive data appropriately
- Follow security best practices

### Code Security

- Keep dependencies updated
- Follow security guidelines
- Report security vulnerabilities responsibly
- Implement proper error handling
- Validate all input

## Getting Help

- Open an issue for questions
- Join our community chat
- Check the documentation
- Contact maintainers

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license. 
