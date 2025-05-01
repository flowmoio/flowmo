import { Link } from '@heroui/link';
import { createClient } from '@/utils/supabase/server';

export default async function SigninHint() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    return null;
  }

  return (
    <div className="mt-4 text-sm">
      <Link href="/signin" underline="always" className="text-sm">
        Sign in
      </Link>{' '}
      to save focus history and tasks.
    </div>
  );
}
