import Dashboard from '@/views/admin/DashboardView.vue';
import AdminRegistrationView from '@/views/admin/AdminRegistrationView.vue';
import ManageTestimonialsView from '@/views/admin/ManageTestimonialsView.vue'
import ManageTalksView from "@/views/admin/ManageTalksView.vue";
import ManageSpeakersView from "@/views/admin/ManageSpeakersView.vue";

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
        path: 'manage-talks',
        name: 'manage-talks',
        component: ManageTalksView,
        meta: { requiresAuth: true },
      },
      {
        path: 'manage-speakers',
        name: 'manage-speakers',
        component: ManageSpeakersView,
        meta: { requiresAuth: true},
      },
    ],
  },
];
