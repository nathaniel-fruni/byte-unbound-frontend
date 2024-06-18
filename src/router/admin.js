import Dashboard from '@/views/admin/DashboardView.vue';
import AdminRegistrationView from '@/views/admin/AdminRegistrationView.vue';
import ManageTestimonialsView from '@/views/admin/ManageTestimonialsView.vue'
import AttendeesView from '@/views/admin/AttendeesView.vue'
import ManageTalksView from "@/views/admin/ManageTalksView.vue";

export default [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
      },
      {
        path: 'admin-registration',
        name: 'admin-registration',
        component: AdminRegistrationView,
        meta: { requiresAuth: true },
      },
      {
        path: 'manage-testimonials',
        name: 'manage-testimonials',
        component: ManageTestimonialsView,
        meta: { requiresAuth: true },
      },
      {
        path: 'show-attendees',
        name: 'show-attendees',
        component: AttendeesView,
        meta: { requiresAuth: true },
      },
      {
        path: 'manage-talks',
        name: 'manage-talks',
        component: ManageTalksView,
        meta: { requiresAuth: true },
      },
    ],
  },
];
