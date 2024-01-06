import {getConcreteInspection, getInspWithCons, getProfile} from "../../curls.js";
import {refactorDate} from "../../MainCodes/mainFunctions.js";

export async function LoadPatientDetails(id) {
    const inspectionData = await fetch(`${getConcreteInspection}${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const inspectionResult = await inspectionData.json();
    console.log(inspectionResult);

    const gender = (inspectionResult.patient.gender === 'Male' ? 'Мужской' : 'Женский');
    const inputDate = await refactorDate(inspectionResult.patient.birthday.substring(0, 10));
    const inputTime = await refactorDate(inspectionResult.createTime.substring(0, 10));

    const time = inspectionResult.createTime.substring(11, 16);
    const conclusion = inspectionResult.conclusion;
    let conclusionText;

    switch (conclusion) {
        case 'Disease':
            conclusionText = 'Болезнь';
            break;
        case 'Death':
            conclusionText = 'Смерть';
            break;
        case 'Recovery':
            conclusionText = 'Выздоровление';
            break;
    }

    const pacientNameElement = document.getElementById('pacientName');
    pacientNameElement.innerHTML += inspectionResult.patient.name;

    const genderElement = document.getElementById('gender');
    genderElement.innerHTML += gender;

    const birthDateElement = document.getElementById('birthDate');
    birthDateElement.innerHTML += inputDate;

    const doctorElement = document.getElementById('doctor');
    doctorElement.innerHTML += inspectionResult.doctor.name;

    const inspectTitleElement = document.getElementById('inspectTitle');
    inspectTitleElement.innerHTML += inputTime + ' - ' + time;

    const complaintInCardElement = document.getElementById('complaintInCard');
    complaintInCardElement.innerHTML += inspectionResult.complaints;

    const anamnesisElement = document.getElementById('anamnez');
    anamnesisElement.innerHTML += inspectionResult.anamnesis;

    const treatmentElement = document.getElementById('recomend');
    treatmentElement.innerHTML += inspectionResult.treatment;

    const conclusionElement = document.getElementById('conclus');
    conclusionElement.innerHTML += conclusionText;


    if (inspectionResult.conclusion === 'Death') {
        const deathDate = await refactorDate(inspectionResult.deathDate.substring(0, 10));
        const deatTime = inspectionResult.deathDate.substring(11, 16);
        document.getElementById('nextVisit').style.display = 'none';
        document.getElementById('deathTime').style.display = 'block';
        document.getElementById('time').textContent = " " + deathDate + " " + deatTime
        const conclusionElement = document.getElementById('conclus');
        conclusionElement.innerHTML += conclusionText;
    }
    else if(inspectionResult.conclusion === 'Recovery'){

        document.getElementById('nextVisit').style.display = 'none';
    }
    else{

        const deathDate = await refactorDate(inspectionResult.nextVisitDate.substring(0, 10));
        const deatTime = inspectionResult.nextVisitDate.substring(11, 16);
        document.getElementById('time').textContent = " " + deathDate + " " + deatTime
        document.getElementById('time').textContent = " " + deathDate + " " + deatTime
    }

    const diagnosticsElement = document.getElementById('Diags');
    const consultationListElement = document.getElementById('consultList');

    for (let i = 0; i < inspectionResult.consultations.length; i++) {
        const consultation = inspectionResult.consultations[i];
        const consultationCard = await fetch('/DetailsDirectory/consultCardInDetails.html');
        const consultationHtml = await consultationCard.text();

        const consultationId = consultation.id;

        const consultationElement = document.createElement('div');
        consultationElement.innerHTML = consultationHtml;
        consultationElement.querySelector('#consulName').innerHTML += consultation.speciality.name;

        const commentsElement = consultationElement.querySelector('#comments');
        const subCommentElement = consultationElement.querySelector('#subComments');

        const responseForConsultation = await fetch(`${getInspWithCons}/${consultation.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const consultationResponse = await responseForConsultation.json();

        for (let j = 0; j < consultationResponse.comments.length; j++) {
            const comment = consultationResponse.comments[j];
            const commentCard = await fetch('/DetailsDirectory/commentCard.html');
            const commentHtml = await commentCard.text();
            const commentElement = document.createElement('div');
            commentElement.innerHTML = commentHtml;
            const parentId = comment.id;

            const createTime = comment.createTime.substring(11, 19);
            const createDate = await refactorDate(comment.createTime.substring(0, 10));

            const responseForProfile = await fetch(`${getProfile}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            const profileResponse = await responseForProfile.json();

            const modTime = comment.modifiedDate.substring(11, 19);
            const modDate = await refactorDate(comment.modifiedDate.substring(0, 10));
            const fullDate = modDate + ' ' + modTime;

            commentElement.querySelector('#authorComment').innerHTML += comment.author;
            commentElement.querySelector('#comContent').innerHTML += comment.content;
            commentElement.querySelector('#date').innerHTML += createDate + ' ' + createTime;

            if (comment.modifiedDate !== comment.createTime) {
                const changed = commentElement.querySelector('#changed');
                changed.style.display = 'block';
                changed.addEventListener('mouseover', async function (e) {
                    this.textContent = `Последнее изменение: ${fullDate}`;
                });
                changed.addEventListener('mouseout', async function (e) {
                    this.textContent = '(изменено)';
                });
            }

            if (profileResponse.id !== comment.authorId) {
                commentElement.querySelector('#editCommentBtn').style.display = 'none';
            }

            commentElement.querySelector('#request').addEventListener('click', async function (e) {
                commentElement.querySelector('#requestForm').style.display = 'block';
                commentElement.querySelector('#requestFormEdit').style.display = 'none';
            });

            commentElement.querySelector('#editCommentBtn').addEventListener('click', async function (e) {
                commentElement.querySelector('#commentInputEdit').value = comment.content;
                commentElement.querySelector('#requestFormEdit').style.display = 'block';
                commentElement.querySelector('#requestForm').style.display = 'none';
            });

            commentElement.querySelector('#openSubs').addEventListener('click', async function (e) {
                subCommentElement.style.display = 'block';
                commentElement.querySelector('#openSubs').style.display = 'none';
                commentElement.querySelector('#closeSubs').style.display = 'block';
            });

            commentElement.querySelector('#closeSubs').addEventListener('click', async function (e) {
                subCommentElement.style.display = 'none';
                commentElement.querySelector('#openSubs').style.display = 'block';
                commentElement.querySelector('#closeSubs').style.display = 'none';
            });

            commentElement.querySelector('#childCreateCommentBtn').addEventListener('click', async function (e) {
                const token = localStorage.getItem('token');
                if (token) {
                    const content = commentElement.querySelector('#commentInput').value;
                    if (content !== '') {
                        const data = {
                            content,
                            parentId
                        };
                        const GUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                        const responseForAddComment = await fetch(`${getInspWithCons}/${consultationId}/comment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(data),
                        });

                        const response = await responseForAddComment.json();
                        console.log(response);
                        if (GUIDPattern.test(response)) {
                            location.reload();
                        }
                    } else {
                        commentElement.querySelector('#childCommentError').style.display = 'block';
                    }
                }
            });

            commentElement.querySelector('#childCreateCommentBtnEdit').addEventListener('click', async function (e) {
                const token = localStorage.getItem('token');
                if (token) {
                    const content = commentElement.querySelector('#commentInputEdit').value;
                    if (content !== '') {
                        const data = {
                            content
                        };
                        const responseForEditComment = await fetch(`${getInspWithCons}/comment/${parentId}`,{
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(data),
                        });

                        if (responseForEditComment.status === 200) {
                            location.reload();
                        }
                    } else {
                        commentElement.querySelector('#childEditCommentError').style.display = 'block';
                    }
                }
            });

            if (comment.parentId != null) {
                commentElement.querySelector('#subsBtn').style.display = 'none';
                subCommentElement.appendChild(commentElement);
            } else {
                commentsElement.appendChild(commentElement);
            }
        }

        consultationListElement.appendChild(consultationElement);
    }

    for (let i = 0; i < inspectionResult.diagnoses.length; i++) {
        const diagnosis = inspectionResult.diagnoses[i];
        const diagnosisCard = await fetch('/DetailsDirectory/diagnosesCardInDetails.html');
        const diagnosisHtml = await diagnosisCard.text();
        let typeDiagnosis;
        const type = diagnosis.type;

        switch (type) {
            case 'Main':
                typeDiagnosis = 'Основной';
                break;
            case 'Concomitant':
                typeDiagnosis = 'Сопутствующий';
                break;
            case 'Complication':
                typeDiagnosis = 'Осложнение';
                break;
        }

        const diagnosisElement = document.createElement('div');
        diagnosisElement.innerHTML = diagnosisHtml;
        diagnosisElement.querySelector('#mkbDiag').innerHTML += diagnosis.name;
        diagnosisElement.querySelector('#typeDiag').innerHTML += typeDiagnosis;
        diagnosisElement.querySelector('#decriptionDiag').innerHTML += diagnosis.description;

        diagnosticsElement.appendChild(diagnosisElement);
    }
}