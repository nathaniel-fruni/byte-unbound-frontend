import HomeView from "../views/public/HomeView.vue";
import SpeakersView from "../views/public/SpeakersView.vue";
import ProgramView from '@/views/public/ProgramView.vue';
// gallery route will be added after creating the view
import ContactView from "../views/public/ContactView.vue";
import RegistrationView from "../views/public/RegistrationView.vue"
import SignInView from '@/views/public/SignInView.vue';


export default [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
      },
      {
        path: "speakers",
        name: "speakers",
        component: SpeakersView,
      },
      {
        path: "program",
        name: "program",
        component: ProgramView,
      },
      {
        path: "registration",
        name: "registration",
        component: RegistrationView,
      },
      {
        path: "contact",
        name: "contact",
        component: ContactView,
      },
      {
        path: "sign-in",
        name: "sign-in",
        component: SignInView,
      },
    ],
  },
];