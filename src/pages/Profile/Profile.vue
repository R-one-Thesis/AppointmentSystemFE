<template>
    <div class="container q-pa-md q-col-gutter-md">
        <div class="patient-details">
            <div class="card">
                <h5>Patient Details</h5>
                <p>Fullname:</p>
                <p>Birthday:</p>
                <p>Sex:</p>
                <p>Home Address:</p>
                <p>Mobile Number:</p>
            </div>
            <div class="medical-record">
                <h5>Medical Record</h5>
                <div class="medical-details">
                    <p>Physician:</p>
                    <p>Physician Address:</p>
                    <p>Reason:</p>
                    <p>Hospitalization:</p>
                    <p>Conditions:</p>
                    <p>Medication:</p>
                    <p>Allergies:</p>
                    <p>Pregnant?:</p>
                    <p>Expected Date:</p>
                    <p>Mens Problems:</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    width: 400px;
    box-shadow: rgba(0, 0, 0, 0.08) 0px 4px 12px;
    display: flex;
    padding: 15px;
    flex-direction: column;
}

.medical-record {
    margin-top: 20px;
    width: auto;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
    padding: 15px;
    
}

.medical-details {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.card h5, .medical-record h5 {
    margin: 0 0 15px 0;
}
.card p, .medical-record p {
    margin-bottom: 10px;
}
</style>