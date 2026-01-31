import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Feature: influencer-platform, Property 1: Project Structure Consistency
 * 
 * For any valid project configuration, the system should maintain consistent
 * technology stack across backend (Express.js, Node.js, MongoDB), 
 * mobile (React Native with Expo), and web (React) components.
 * 
 * Validates: Requirements 10.1, 10.2, 10.3
 */

describe('Project Structure Consistency', () => {
  const projectRoot = path.resolve(__dirname, '../../../');
  
  // Helper function to read and parse package.json files
  const readPackageJson = (packagePath: string) => {
    try {
      const fullPath = path.join(projectRoot, packagePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read package.json at ${packagePath}: ${error}`);
    }
  };

  // Helper function to check if a dependency exists in package.json
  const hasDependency = (packageJson: any, depName: string): boolean => {
    return !!(
      (packageJson.dependencies && packageJson.dependencies[depName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[depName])
    );
  };

  // Helper function to check if a script exists in package.json
  const hasScript = (packageJson: any, scriptName: string): boolean => {
    return !!(packageJson.scripts && packageJson.scripts[scriptName]);
  };

  test('Backend project structure follows Express.js, Node.js, MongoDB requirements', () => {
    fc.assert(
      fc.property(
        fc.constant('backend/package.json'), // We're testing the actual backend package.json
        (packagePath) => {
          const backendPackage = readPackageJson(packagePath);
          
          // Requirement 10.1: Backend SHALL use Express.js, Node.js, and MongoDB
          const hasExpress = hasDependency(backendPackage, 'express');
          const hasMongoose = hasDependency(backendPackage, 'mongoose'); // MongoDB ODM
          const hasNodeTypes = hasDependency(backendPackage, '@types/node');
          const hasTypeScript = hasDependency(backendPackage, 'typescript');
          const hasJest = hasDependency(backendPackage, 'jest');
          const hasFastCheck = hasDependency(backendPackage, 'fast-check');
          
          // Check essential scripts
          const hasTestScript = hasScript(backendPackage, 'test');
          const hasDevScript = hasScript(backendPackage, 'dev');
          
          // Validate Node.js engine requirement
          const hasNodeEngine = !!(backendPackage.engines && backendPackage.engines.node);
          
          return (
            hasExpress &&
            hasMongoose &&
            hasNodeTypes &&
            hasTypeScript &&
            hasJest &&
            hasFastCheck &&
            hasTestScript &&
            hasDevScript &&
            hasNodeEngine
          );
        }
      ),
      { numRuns: 100, verbose: true }
    );
  });

  test('Mobile project structure follows React Native with Expo requirements', () => {
    fc.assert(
      fc.property(
        fc.constant('mobile/package.json'), // We're testing the actual mobile package.json
        (packagePath) => {
          const mobilePackage = readPackageJson(packagePath);
          
          // Requirement 10.2: Mobile SHALL use React Native with Expo
          const hasReact = hasDependency(mobilePackage, 'react');
          const hasReactNative = hasDependency(mobilePackage, 'react-native');
          const hasExpo = hasDependency(mobilePackage, 'expo');
          const hasExpoRouter = hasDependency(mobilePackage, 'expo-router');
          const hasTypeScript = hasDependency(mobilePackage, 'typescript');
          const hasJest = hasDependency(mobilePackage, 'jest');
          const hasFastCheck = hasDependency(mobilePackage, 'fast-check');
          const hasTestingLibrary = hasDependency(mobilePackage, '@testing-library/react-native');
          
          // Check essential scripts
          const hasTestScript = hasScript(mobilePackage, 'test');
          const hasStartScript = hasScript(mobilePackage, 'start');
          const hasAndroidScript = hasScript(mobilePackage, 'android');
          const hasIosScript = hasScript(mobilePackage, 'ios');
          
          // Check Jest preset for Expo
          const hasExpoJestPreset = mobilePackage.jest && mobilePackage.jest.preset === 'jest-expo';
          
          return (
            hasReact &&
            hasReactNative &&
            hasExpo &&
            hasExpoRouter &&
            hasTypeScript &&
            hasJest &&
            hasFastCheck &&
            hasTestingLibrary &&
            hasTestScript &&
            hasStartScript &&
            hasAndroidScript &&
            hasIosScript &&
            hasExpoJestPreset
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Web project structure follows React requirements', () => {
    fc.assert(
      fc.property(
        fc.constant('web/package.json'), // We're testing the actual web package.json
        (packagePath) => {
          const webPackage = readPackageJson(packagePath);
          
          // Requirement 10.3: Web SHALL use React
          const hasReact = hasDependency(webPackage, 'react');
          const hasReactDom = hasDependency(webPackage, 'react-dom');
          const hasReactRouter = hasDependency(webPackage, 'react-router-dom');
          const hasTypeScript = hasDependency(webPackage, 'typescript');
          const hasJest = hasDependency(webPackage, 'jest');
          const hasFastCheck = hasDependency(webPackage, 'fast-check');
          const hasTestingLibrary = hasDependency(webPackage, '@testing-library/react');
          const hasMaterialUI = hasDependency(webPackage, '@mui/material');
          
          // Check essential scripts
          const hasTestScript = hasScript(webPackage, 'test');
          const hasStartScript = hasScript(webPackage, 'start');
          const hasBuildScript = hasScript(webPackage, 'build');
          
          return (
            hasReact &&
            hasReactDom &&
            hasReactRouter &&
            hasTypeScript &&
            hasJest &&
            hasFastCheck &&
            hasTestingLibrary &&
            hasMaterialUI &&
            hasTestScript &&
            hasStartScript &&
            hasBuildScript
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Root project maintains workspace consistency', () => {
    fc.assert(
      fc.property(
        fc.constant('package.json'), // We're testing the root package.json
        (packagePath) => {
          const rootPackage = readPackageJson(packagePath);
          
          // Check workspace configuration
          const hasWorkspaces = Array.isArray(rootPackage.workspaces);
          const workspaces = rootPackage.workspaces || [];
          const hasBackendWorkspace = workspaces.includes('backend');
          const hasMobileWorkspace = workspaces.includes('mobile');
          const hasWebWorkspace = workspaces.includes('web');
          
          // Check coordinated scripts
          const hasTestScript = hasScript(rootPackage, 'test');
          const hasLintScript = hasScript(rootPackage, 'lint');
          const hasDevScript = hasScript(rootPackage, 'dev');
          
          return (
            hasWorkspaces &&
            hasBackendWorkspace &&
            hasMobileWorkspace &&
            hasWebWorkspace &&
            hasTestScript &&
            hasLintScript &&
            hasDevScript
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Development tools consistency across all projects', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('backend/package.json', 'mobile/package.json', 'web/package.json'),
        (packagePath) => {
          const packageJson = readPackageJson(packagePath);
          
          // All projects should have consistent development tools
          const hasTypeScript = hasDependency(packageJson, 'typescript');
          const hasJest = hasDependency(packageJson, 'jest');
          const hasFastCheck = hasDependency(packageJson, 'fast-check');
          const hasESLint = hasDependency(packageJson, 'eslint');
          const hasPrettier = hasDependency(packageJson, 'prettier');
          
          // All projects should have essential scripts
          const hasTestScript = hasScript(packageJson, 'test');
          const hasLintScript = hasScript(packageJson, 'lint');
          const hasLintFixScript = hasScript(packageJson, 'lint:fix');
          const hasFormatScript = hasScript(packageJson, 'format');
          
          return (
            hasTypeScript &&
            hasJest &&
            hasFastCheck &&
            hasESLint &&
            hasPrettier &&
            hasTestScript &&
            hasLintScript &&
            hasLintFixScript &&
            hasFormatScript
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});