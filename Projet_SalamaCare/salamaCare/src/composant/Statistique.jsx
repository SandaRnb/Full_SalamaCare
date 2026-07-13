import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            callbacks: {
                label: (context) => `${context.parsed.y}`,
            },
        },
    },
    scales: {
        x: {
            grid: { display: false },
            ticks: { color: '#64748b' },
        },
        y: {
            grid: { color: 'rgba(148,163,184,0.15)' },
            ticks: { color: '#ffffff', beginAtZero: true },
        },
    },
}

function SummaryCard({ title, value, caption }) {
    return (
        <div className='summary-card'>
            <div>
                <p className='summary-title'>{title}</p>
                <strong className='summary-value'>{value}</strong>
            </div>
            <p className='summary-caption'>{caption}</p>
        </div>
    )
}

export function StatistiqueGeneral({ medecins = [], dossiers = [], rendezVous = [] }) {
    const totalPatients = dossiers.length
    const totalDoctors = medecins.length
    const totalAppointments = rendezVous.length
    const availableDoctors = medecins.filter((doctor) => doctor.disponibilite).length
    const confirmedAppointments = rendezVous.filter((rdv) => rdv.statut === 'confirmé').length
    const pendingAppointments = rendezVous.filter((rdv) => rdv.statut === 'planifié').length
    const reportedAppointments = rendezVous.filter((rdv) => rdv.statut === 'reporté').length

    const currentMonthIndex = new Date().getMonth()
    const labels = Array.from({ length: currentMonthIndex + 1 }, (_, index) =>
        new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(2024, index, 1))
    )

    const countByMonth = (items, dateField) => {
        const counts = new Array(labels.length).fill(0)

        items.forEach((item) => {
            const dateValue = item?.[dateField]
            const date = dateValue ? new Date(dateValue) : null
            if (date instanceof Date && !Number.isNaN(date.getTime())) {
                const monthIndex = date.getMonth()
                if (monthIndex >= 0 && monthIndex < labels.length) {
                    counts[monthIndex] += 1
                }
            }
        })

        return counts
    }

    const patientMonthlyCounts = countByMonth(dossiers, 'dateCreation')
    const patientsSeries = patientMonthlyCounts.reduce((acc, value, index) => {
        if (index === 0) return [value]
        return [...acc, acc[index - 1] + value]
    }, [])

    const appointmentsSeries = countByMonth(rendezVous, 'dateHeure')

    const patientsData = {
        labels,
        datasets: [
            {
                label: 'Patients',
                data: patientsSeries,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.25)',
                fill: true,
                tension: 0.35,
                pointRadius: 4,
                pointBackgroundColor: '#1d4ed8',
            },
        ],
    }

    const appointmentsData = {
        labels,
        datasets: [
            {
                label: 'Rendez-vous',
                data: appointmentsSeries,
                borderColor: '#0f766e',
                backgroundColor: 'rgba(15, 118, 110, 0.22)',
                fill: true,
                tension: 0.25,
                pointRadius: 4,
                pointBackgroundColor: '#0f766e',
            },
        ],
    }

    const staffCompositionData = {
        labels: ['Patients', 'Médecins'],
        datasets: [
            {
                label: 'Effectif',
                data: [totalPatients, totalDoctors],
                backgroundColor: ['rgba(37, 199, 235, 0.75)', 'rgba(194, 65, 12, 0.75)'],
                borderColor: ['#1d4ed8', '#9a3412'],
                borderWidth: 2,
                hoverOffset: 8,
            },
        ],
    }

    return (
        <div className='hospital-stats-page'>
            <div className='hospital-overview'>
                <SummaryCard title='Patients suivis' value={totalPatients} caption='Nombre total de dossiers patients enregistrés' />
                <SummaryCard title='Médecins actifs' value={totalDoctors} caption='Equipe médicale disponible pour les consultations' />
                <SummaryCard title='Rendez-vous' value={totalAppointments} caption={`${confirmedAppointments} confirmés • ${pendingAppointments} planifiés • ${reportedAppointments} reportés`} />
                <SummaryCard title='Médecins disponibles' value={availableDoctors} caption='Médecins actuellement disponibles' />
            </div>

            <div className='hospital-charts'>
                <div className='chart-card'>
                    <div className='chart-card-header'>
                        <h3>Tendance patients</h3>
                        <p>Evolution mensuelle des patients</p>
                    </div>
                    <div style={{ minHeight: 180 }}>
                        <Line options={chartOptions} data={patientsData} />
                    </div>
                </div>

                <div className='chart-card'>
                    <div className='chart-card-header'>
                        <h3>Rendez-vous</h3>
                        <p>Courbe des rendez-vous pris</p>
                    </div>
                    <div style={{ minHeight: 180 }}>
                        <Line options={chartOptions} data={appointmentsData} />
                    </div>
                </div>
                <div className='chart-card full-width'>
                    <div className='chart-card-header'>
                        <h3>Effectif Médecins / Patients</h3>
                        <p>Répartition des effectifs</p>
                    </div>
                    <div style={{ minHeight: 260 }}>
                        <Doughnut
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: { color: '#64748b' }
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => `${context.label}: ${context.parsed}`
                                        }
                                    }
                                }
                            }}
                            data={staffCompositionData}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
















