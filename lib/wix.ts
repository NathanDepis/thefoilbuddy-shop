import { createClient, OAuthStrategy } from '@wix/sdk';
import { products } from '@wix/stores';
import { currentCart } from '@wix/ecom';

const clientId = process.env.NEXT_PUBLIC_WIX_CLIENT_ID;
if (!clientId) throw new Error('NEXT_PUBLIC_WIX_CLIENT_ID is not set');

export const wixClient = createClient({
  modules: { products, currentCart },
  auth: OAuthStrategy({ clientId }),
});
