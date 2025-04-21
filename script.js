// Remplacez ces valeurs par celles de votre projet Supabase
const supabaseUrl = https://mfwkukviweqfkgiiucfm.supabase.co;
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1md2t1a3Zpd2VxZmtnaWl1Y2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjQ5MDgsImV4cCI6MjA2MDg0MDkwOH0.Dmu3rUdLBhe9eS1g8F4YZpeSTm_nJXjA71xvN8Yvm5A;

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function loadRequests() {
  const { data, error } = await supabase
    .from('requests')
    .select('*')
    .order('inserted_at', { ascending: false });
  if (error) return console.error(error);
  renderTable(data);
  updateStats(data);
}

async function submitRequest(event) {
  event.preventDefault();
  const nom = document.getElementById('nom').value;
  const dateDebut = document.getElementById('dateDebut').value;
  const dateFin = document.getElementById('dateFin').value;
  const motif = document.getElementById('motif').value;
  const { error } = await supabase
    .from('requests')
    .insert([{ nom, start_date: dateDebut, end_date: dateFin, reason: motif }]);
  if (error) return alert('Erreur: ' + error.message);
  document.getElementById('congeForm').reset();
  loadRequests();
}

async function changeStatus(id, status) {
  const { error } = await supabase
    .from('requests')
    .update({ status })
    .eq('id', id);
  if (error) return alert('Erreur: ' + error.message);
  loadRequests();
}

function renderTable(requests) {
  const tbody = document.querySelector('#requestsTable tbody');
  tbody.innerHTML = '';
  requests.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.nom}</td>
      <td>${r.start_date}</td>
      <td>${r.end_date}</td>
      <td>${r.reason || ''}</td>
      <td>${r.status}</td>
      <td>
        <button onclick="changeStatus('${r.id}', 'pending')">⏳</button>
        <button onclick="changeStatus('${r.id}', 'approved')">✅</button>
        <button onclick="changeStatus('${r.id}', 'rejected')">❌</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateStats(requests) {
  document.getElementById('total').textContent = requests.length;
  document.getElementById('pending').textContent = requests.filter(r => r.status === 'pending').length;
  document.getElementById('approved').textContent = requests.filter(r => r.status === 'approved').length;
  document.getElementById('rejected').textContent = requests.filter(r => r.status === 'rejected').length;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('congeForm').addEventListener('submit', submitRequest);
  loadRequests();
});
