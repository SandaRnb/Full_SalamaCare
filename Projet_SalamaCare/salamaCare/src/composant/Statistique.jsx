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


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
)


const chartOptions = {

    responsive: true,
    maintainAspectRatio: false,

    plugins: {

        legend: {
            display: false,
        },

        tooltip: {

            callbacks: {

                label: (context) =>
                    `${context.parsed.y}`

            }

        }

    },

    scales: {

        x: {
            grid: {
                display: false
            },

            ticks: {
                color: '#64748b'
            }
        },


        y: {

            grid: {
                color: 'rgba(148,163,184,0.15)'
            },

            ticks: {
                color: '#ffffff',
                beginAtZero: true
            }

        }

    }

}



function SummaryCard({ title, value, caption }) {

    return (

        <div className="summary-card">

            <div>

                <p className="summary-title">
                    {title}
                </p>


                <strong className="summary-value">
                    {value}
                </strong>

            </div>


            <p className="summary-caption">
                {caption}
            </p>

        </div>

    )

}





export function StatistiqueGeneral({

    medecins = [],
    dossiers = [],
    rendezVous = []

}) {


    console.log("STATISTIQUES", {
        patients: dossiers,
        medecins,
        rendezVous
    })



    // ==========================
    // STATISTIQUES GENERALES
    // ==========================


    const totalPatients = dossiers.length


    const totalDoctors = medecins.length


    const totalAppointments = rendezVous.length



    const availableDoctors =
        medecins.filter(
            doctor => doctor.disponibilite
        ).length



    const confirmedAppointments =
        rendezVous.filter(
            rdv => rdv.statut === "confirmé"
        ).length



    const pendingAppointments =
        rendezVous.filter(
            rdv => rdv.statut === "planifié"
        ).length



    const reportedAppointments =
        rendezVous.filter(
            rdv => rdv.statut === "reporté"
        ).length





    // ==========================
    // MOIS
    // ==========================


    const currentMonthIndex =
        new Date().getMonth()



    const labels =
        Array.from(
            {
                length: currentMonthIndex + 1
            },

            (_, index) =>

                new Intl.DateTimeFormat(
                    'fr-FR',
                    {
                        month: 'short'
                    }
                ).format(
                    new Date(
                        new Date().getFullYear(),
                        index,
                        1
                    )
                )

        )






    // ==========================
    // COMPTE PAR MOIS
    // ==========================


    const countByMonth = (
        items,
        dateField

    ) => {


        const counts =
            new Array(
                labels.length
            ).fill(0)



        items.forEach(item => {


            const dateValue =
                item?.[dateField]



            if(dateValue){


                const date =
                    new Date(dateValue)



                if(
                    !Number.isNaN(
                        date.getTime()
                    )
                ){


                    const month =
                        date.getMonth()



                    if(
                        month < labels.length
                    ){

                        counts[month]++

                    }

                }

            }

        })


        return counts

    }






    // ==========================
    // PATIENTS
    // ==========================


    const patientDateField =
        dossiers.length > 0 &&
        dossiers[0].created_at

            ?

        "created_at"

            :

        "dateCreation"



    const patientMonthlyCounts =
        countByMonth(
            dossiers,
            patientDateField
        )




    const patientsSeries =
        patientMonthlyCounts.reduce(

            (acc, value, index) => {


                if(index === 0)

                    return [value]


                return [
                    ...acc,
                    acc[index - 1] + value
                ]

            },

            []

        )






    const patientsData = {


        labels,


        datasets: [

            {

                label: "Patients",

                data: patientsSeries,


                fill: true,


                tension: 0.35,


                pointRadius: 4,


                borderColor: "#2563eb",


                backgroundColor:
                    "rgba(37,99,235,0.25)"

            }

        ]

    }






    // ==========================
    // RENDEZ-VOUS
    // ==========================


    const appointmentsData = {


        labels,


        datasets: [

            {

                label:"Rendez-vous",


                data:

                    countByMonth(
                        rendezVous,
                        "dateHeure"
                    ),


                fill:true,


                tension:0.25,


                pointRadius:4,


                borderColor:"#0f766e",


                backgroundColor:
                    "rgba(15,118,110,0.22)"

            }

        ]

    }






    // ==========================
    // EFFECTIF
    // ==========================


    const staffCompositionData = {


        labels:[

            "Patients",

            "Médecins"

        ],



        datasets:[

            {

                label:"Effectif",


                data:[

                    totalPatients,

                    totalDoctors

                ],


                backgroundColor:[

                    "rgba(37,199,235,0.75)",

                    "rgba(194,65,12,0.75)"

                ],


                borderWidth:2,


                hoverOffset:8

            }

        ]

    }







    return (

        <div className="hospital-stats-page">


            <div className="hospital-overview">


                <SummaryCard

                    title="Patients suivis"

                    value={totalPatients}

                    caption="Nombre total de dossiers patients enregistrés"

                />



                <SummaryCard

                    title="Médecins actifs"

                    value={totalDoctors}

                    caption="Equipe médicale disponible"

                />



                <SummaryCard

                    title="Rendez-vous"

                    value={totalAppointments}

                    caption={
                        `${confirmedAppointments} confirmés • 
                        ${pendingAppointments} planifiés • 
                        ${reportedAppointments} reportés`
                    }

                />



                <SummaryCard

                    title="Médecins disponibles"

                    value={availableDoctors}

                    caption="Médecins actuellement disponibles"

                />


            </div>





            <div className="hospital-charts">



                <div className="chart-card">


                    <div className="chart-card-header">

                        <h3>
                            Tendance patients
                        </h3>


                        <p>
                            Evolution mensuelle des patients
                        </p>

                    </div>



                    <div style={{minHeight:180}}>

                        <Line

                            options={chartOptions}

                            data={patientsData}

                        />

                    </div>


                </div>





                <div className="chart-card">


                    <div className="chart-card-header">

                        <h3>
                            Rendez-vous
                        </h3>


                        <p>
                            Courbe des rendez-vous pris
                        </p>

                    </div>



                    <div style={{minHeight:180}}>

                        <Line

                            options={chartOptions}

                            data={appointmentsData}

                        />

                    </div>


                </div>





                <div className="chart-card full-width">


                    <div className="chart-card-header">

                        <h3>
                            Effectif Médecins / Patients
                        </h3>


                        <p>
                            Répartition dynamique des effectifs
                        </p>

                    </div>



                    <div style={{minHeight:260}}>


                        <Doughnut

                            data={staffCompositionData}


                            options={{

                                responsive:true,

                                maintainAspectRatio:false,


                                plugins:{

                                    legend:{

                                        position:"bottom"

                                    }

                                }

                            }}

                        />


                    </div>


                </div>



            </div>


        </div>

    )

}