import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // You can add any global setup code here, like authentication setup
  console.log('Running global setup...');
}

export default globalSetup; 