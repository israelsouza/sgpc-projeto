import { router } from 'expo-router';

/**
 * Utilitário de navegação segura para suportar Web e Mobile.
 * Resolve o problema do router.back() falhar na Web quando não há histórico (ex: após F5).
 */
export const navigation = {
  /**
   * Tenta voltar para a tela anterior. 
   * Se não houver histórico, redireciona para a rota de fallback.
   */
  safeBack: (fallbackRoute: string = '/home') => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute as any);
    }
  },

  /**
   * Atalho para router.push que garante caminhos limpos (sem grupos como (tabs)).
   */
  push: (route: string, params?: any) => {
    const cleanRoute = route.replace(/\/\((auth|tabs)\)/g, '');
    router.push({ pathname: cleanRoute as any, params });
  },

  /**
   * Atalho para router.replace que garante caminhos limpos.
   */
  replace: (route: string) => {
    const cleanRoute = route.replace(/\/\((auth|tabs)\)/g, '');
    router.replace(cleanRoute as any);
  }
};
