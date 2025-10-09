import { AdMobBanner, AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';

/**
 * Ad service for non-intrusive monetization
 * Ads shown between games and in menus
 */

export class AdService {
  private static instance: AdService;
  private interstitialLoaded = false;

  // Replace with your actual AdMob IDs
  private readonly BANNER_AD_ID = __DEV__
    ? 'ca-app-pub-3940256099942544/6300978111' // Test ID
    : 'ca-app-pub-YOUR_ID/YOUR_BANNER_ID';

  private readonly INTERSTITIAL_AD_ID = __DEV__
    ? 'ca-app-pub-3940256099942544/1033173712' // Test ID
    : 'ca-app-pub-YOUR_ID/YOUR_INTERSTITIAL_ID';

  private constructor() {
    this.initializeAds();
  }

  static getInstance(): AdService {
    if (!AdService.instance) {
      AdService.instance = new AdService();
    }
    return AdService.instance;
  }

  private async initializeAds() {
    if (__DEV__) {
      await setTestDeviceIDAsync('EMULATOR');
    }
    this.loadInterstitial();
  }

  /**
   * Load interstitial ad for game transitions
   */
  async loadInterstitial() {
    try {
      await AdMobInterstitial.setAdUnitID(this.INTERSTITIAL_AD_ID);
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
      this.interstitialLoaded = true;
    } catch (error) {
      console.log('Failed to load interstitial:', error);
      this.interstitialLoaded = false;
    }
  }

  /**
   * Show interstitial ad (e.g., after game ends)
   */
  async showInterstitial(): Promise<void> {
    if (this.interstitialLoaded) {
      try {
        await AdMobInterstitial.showAdAsync();
        this.interstitialLoaded = false;
        // Preload next ad
        setTimeout(() => this.loadInterstitial(), 1000);
      } catch (error) {
        console.log('Failed to show interstitial:', error);
      }
    }
  }

  /**
   * Get banner ad unit ID for use in components
   */
  getBannerAdId(): string {
    return this.BANNER_AD_ID;
  }
}

export const adService = AdService.getInstance();