import AccountForm from './account-form'
// import { createClient } from '@/utils/supabase/server'
import { createClient } from "@/lib/auth/server";

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <AccountForm user={user} />
}