<template>
  <div style="display: flex; justify-content: center; align-items: center">
    <section v-if="!user">
      <h2>Admin Login</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email" required />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      <p v-if="error">
        {{ error }}
      </p>
    </section>
    <section v-else>
      <h2>Intake Submissions</h2>
      <div>
        <label>Filter by Name:</label>
        <input v-model="filter" placeholder="Type name..." />
        <button @click="fetchSubmissions">Apply Filter</button>
        <button @click="logout">Logout</button>
      </div>
      <table>
        <thead>
          <tr>
            <th v-for="field in fields" :key="field">
              {{ field }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in submissions" :key="submission.id">
            <td v-for="field in fields" :key="field">
              {{ submission[field] }}
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="submissions.length === 0">No submissions found.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Session, User } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";

const supabase = useSupabaseClient<Database>();

const session = ref<Session | null>(null);
const user = ref<User | null>(null);

const email = ref("");
const password = ref("");
const error = ref("");
const filter = ref("");
interface IntakeSubmission {
  id: string;
  created_at: string;
  email: string;
  phone: string;
  status: string;
  [key: string]: string;
}
const submissions = ref<IntakeSubmission[]>([]);
const fields = [
  "id",
  "created_at",
  "updated_at",
  "status",
  "first_name",
  "last_name",
  "email",
  "phone",
  "case_type",
  "case_description",
  "incident_date",
  "location",
  "urgency",
  "lawyer_notes",
  "assigned_lawyer_id",
];

async function login() {
  error.value = "";
  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (loginError) {
    error.value = loginError.message;
    return;
  }
  session.value = data.session;
  user.value = data.user;
}

async function logout() {
  await supabase.auth.signOut();
  session.value = null;
  user.value = null;
  window.location.reload();
}

async function fetchSubmissions() {
  let query = supabase.from("intake_submissions").select("*");
  if (filter.value) {
    query = query.ilike("name", `%${filter.value}%`);
  }
  const { data, error: fetchError } = await query;
  if (fetchError) {
    error.value = fetchError.message;
    submissions.value = [];
  } else {
    submissions.value = (data as IntakeSubmission[]) || [];
  }
}

onMounted(() => {
  const currentSession = supabase.auth.getSession();
  currentSession.then(({ data }) => {
    if (data?.session) {
      session.value = data.session;
      user.value = data.session.user;
      fetchSubmissions();
    }
  });
  supabase.auth.onAuthStateChange((_event, sessionData) => {
    session.value = sessionData;
    user.value = sessionData?.user || null;
    if (user.value) fetchSubmissions();
  });
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
}
</style>
