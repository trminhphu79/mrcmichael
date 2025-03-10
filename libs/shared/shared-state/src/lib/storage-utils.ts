export const storageUtils = {
  isStorageAvailable(): boolean {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },

  getStorageUsage(): { used: number; total: number } {
    let total = 0;
    let used = 0;

    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            used += value.length * 2;
          }
        }
      }
      total = 5 * 1024 * 1024;
    } catch (e) {
      console.error('Error calculating storage usage:', e);
    }

    return { used, total };
  },
};
