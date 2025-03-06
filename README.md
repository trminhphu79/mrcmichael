# Mrcmichael

A micro-frontend project using Nx workspace with Angular and React.


## Author
Michael Tran - Dev79

### Connect with me
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/tmp-dev79/)

### Portfolio
🌐 [phutran.info.vn](https://phutran.info.vn)

## Prerequisites

Before you begin, ensure you have installed:
- Node.js and npm
- Nx CLI: `npm install -g nx`

## Project Setup

1. Create new Nx workspace:
```bash
npx create-nx-workspace@latest --preset=apps --appName=mrcmichael
```

2. Add required capabilities:
```bash
npx nx add @nx/angular
npx nx add @nx/react
```

## Creating Applications

### Host Application
Create the shell (host) application with:
```bash
npx nx g @nx/angular:host apps/shell --dynamic --remotes=michael
```

### Remote Applications
Add remote applications using:
```bash
# For React remotes
npx nx g @nx/react:remote apps/react-app

# For Angular remotes
npx nx g @nx/angular:remote apps/angular-app
```

## Running the Application

### Development Server
To run the application locally:
```bash
npx nx serve shell --open
```

### Production Build
To create a production build:
```bash
npx nx build shell --configuration=production
```

## Important Configuration Notes

1. **Remote Application Setup**
   - After initializing a new remote application, update the `module-federation.manifest.json` file with the new remote configuration
   - Ensure the port numbers in the configuration match the 'serve' configuration in the respective `project.json` file

## Project Structure


## Next Action
- Setup nginx to deploy real server work
- Integrate with Vue and others frameworks
