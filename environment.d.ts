/* eslint-disable @typescript-eslint/no-unused-vars */
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: string;
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: string;
    NEXT_PUBLIC_PAYPAL_SECRET_CODE: string;
    NEXT_PUBLIC_PAYPAL_MONTHLY_PLAN_ID: string;
    NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID: string;
    NEXT_PUBLIC_PAYPAL_AUTH_URL: string;
    NEXT_PUBLIC_PAYPAL_API_URL: string;
    NEXT_PUBLIC_TODOIST_CLIENT_ID: string;
    TODOIST_CLIENT_SECRET: string;

    NEXT_PUBLIC_PADDLE_ENV: 'sandbox' | 'production';
    NEXT_PUBLIC_PADDLE_API_URL: string;
    PADDLE_API_KEY: string;
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: string;
    NEXT_PUBLIC_PADDLE_SELLER_ID: string;
    NEXT_PUBLIC_PADDLE_MONTHLY_PLAN_ID: string;
    NEXT_PUBLIC_PADDLE_YEARLY_PLAN_ID: string;
    PADDLE_SECRET_KEY: string;
  }
}
