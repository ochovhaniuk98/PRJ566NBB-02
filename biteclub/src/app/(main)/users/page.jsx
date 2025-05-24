
// ========================
// !!! WILL REMOVE SOON !!!
// ========================

// import { redirect } from 'next/navigation';
// import { LogoutButton } from '@/components/auth/Logout-button';
// import { createClient } from '@/lib/auth/server';
// import MainBaseContainer from '@/components/shared/MainBaseContainer';

// export default async function ProtectedPage() {
//   const supabase = await createClient();

//   const { data, error } = await supabase.auth.getUser();
//   // console.log(data.user)
//   if (error || !data?.user) {
//     redirect('/login');
//   }

//   return (
//     <MainBaseContainer>
//       <div className="main-side-padding mb-16 w-full flex flex-col items-center justify-center h-svh">
//         <h1 className="text-3xl font-bold">User Dashboard</h1>
//         <p>
//           Welcome back, <span>{data.user.user_metadata.name}!</span>
//         </p>
//         <LogoutButton />
//       </div>
//     </MainBaseContainer>
//   );
// }
