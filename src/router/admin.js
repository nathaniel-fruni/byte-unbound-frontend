import Dashboard from '@/views/admin/DashboardView.vue';

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
    ],
  },
];
