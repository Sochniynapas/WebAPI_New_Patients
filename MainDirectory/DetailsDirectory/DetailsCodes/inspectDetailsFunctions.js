import {getConcreteInspection, getInspWithCons, getProfile} from "../../curls.js";
import {refactorDate} from "../../MainCodes/mainFunctions.js";

export async function FillTheDetailsParams(id){
    const responseData = await fetch(`${getConcreteInspection}${id}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });
    debugger
    const response = await responseData.json();
    console.log(response)
    const gender=(response.patient.gender==="Male"? "Мужской" : "Женский")

    const inputDate =await refactorDate(response.patient.birthday.substring(0, 10))
    const inputTime =await refactorDate(response.createTime.substring(0, 10))

    const time=response.createTime.substring(11,16)
    const conclus=response.conclusion
    let conclusVal

    switch (conclus){
        case 'Disease':
            conclusVal='Болезнь'
            break
        case 'Death':
            conclusVal='Смерть'
            break
        case 'Recovery':
            conclusVal='Выздоровление'
            break
    }

    document.getElementById('pacientName').innerHTML+=response.patient.name
    document.getElementById('gender').innerHTML+=gender
    document.getElementById('birthDate').innerHTML+=inputDate
    document.getElementById('doctor').innerHTML+=response.doctor.name
    document.getElementById('inspectTitle').innerHTML+=inputTime+' - '+time
    document.getElementById('complaintInCard').innerHTML+=response.complaints
    document.getElementById('anamnez').innerHTML+=response.anamnesis
    document.getElementById('recomend').innerHTML+=response.treatment
    document.getElementById('conclus').innerHTML+=conclusVal


    if(response.conclusion=='Death'){
        document.getElementById('nextVisit').style.display='none'
        document.getElementById('deathTime').style.display='block'
    }
    const Diags=document.getElementById('Diags')

    const consultList=document.getElementById('consultList')

    for(let i=0; i<response.consultations.length;i++){
        const consult=response.consultations[i]
        const consultCard= await fetch('/DetailsDirectory/consultCardInDetails.html')
        const consultToElement=await consultCard.text()

        const consultId=consult.id

        const consultElement=document.createElement('div')
        consultElement.innerHTML=consultToElement
        consultElement.querySelector('#consulName').innerHTML+=consult.speciality.name

        const comments=consultElement.querySelector('#comments')
        const subComment=consultElement.querySelector('#subComments')

        const responseForCons = await fetch(`${getInspWithCons}/${consult.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const responseConsult = await responseForCons.json()



        for(let i=0; i<responseConsult.comments.length;i++){
            const comment=responseConsult.comments[i]

            const commentCard= await fetch('/DetailsDirectory/commentCard.html')
            const commentToElement=await commentCard.text()

            const commentElement=document.createElement('div')
            commentElement.innerHTML=commentToElement
            const parentId=comment.id

            const createTime=comment.createTime.substring(11,19)
            const createDate=await refactorDate(comment.createTime.substring(0, 10))



            const responseForProfile = await fetch(`${getProfile}`,{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            const responseProfile=await responseForProfile.json();

            const modTime=comment.modifiedDate.substring(11,19)
            const modData=await refactorDate(comment.modifiedDate.substring(0, 10))
            const fullDate=modData+' '+modTime

            commentElement.querySelector('#authorComment').innerHTML+=comment.author
            commentElement.querySelector('#comContent').innerHTML+=comment.content
            commentElement.querySelector('#date').innerHTML+=createDate+' '+createTime


            if(comment.modifiedDate !== comment.createTime){
                const changed=commentElement.querySelector('#changed')
                changed.style.display='block'
                changed.addEventListener('mouseover', async function(e){
                    this.textContent = `Последнее изменение: ${fullDate}`
                })
                changed.addEventListener('mouseout', async function(e){
                    this.textContent = '(изменено)'
                })
            }

            if(responseProfile.id !== comment.authorId){
                commentElement.querySelector('#editCommentBtn').style.display='none'
            }



            commentElement.querySelector('#request').addEventListener('click', async function(e){

                commentElement.querySelector('#requestForm').style.display='block'
                commentElement.querySelector('#requestFormEdit').style.display='none'
            })

            commentElement.querySelector('#editCommentBtn').addEventListener('click', async function(e){
                commentElement.querySelector('#commentInputEdit').value=comment.content
                commentElement.querySelector('#requestFormEdit').style.display='block'
                commentElement.querySelector('#requestForm').style.display='none'
            })

            commentElement.querySelector('#openSubs').addEventListener('click', async function(e){
                subComment.style.display='block'
                commentElement.querySelector('#openSubs').style.display='none'
                commentElement.querySelector('#closeSubs').style.display='block'

            })

            commentElement.querySelector('#closeSubs').addEventListener('click', async function(e){
                subComment.style.display='none'
                commentElement.querySelector('#openSubs').style.display='block'
                commentElement.querySelector('#closeSubs').style.display='none'

            })

            commentElement.querySelector('#childCreateCommentBtn').addEventListener('click', async function(e){
                const token=localStorage.getItem('token')
                if(token){
                    const content=commentElement.querySelector('#commentInput').value
                    if(content !== ''){
                        const data={
                            content,
                            parentId
                        }
                        const GUIDPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                        debugger
                        const responseForAddComment = await fetch(`${getInspWithCons}/${consultId}/comment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(data),
                        });


                        const response = await responseForAddComment.json();
                        console.log(response);
                        if(GUIDPattern.test(response)){
                            location.reload()
                        }
                    }
                    else{
                        commentElement.querySelector('#childCommentError').style.display='block'
                    }
                }

            })

            commentElement.querySelector('#childCreateCommentBtnEdit').addEventListener('click', async function(e){
                const token=localStorage.getItem('token')
                if(token){
                    const content=commentElement.querySelector('#commentInputEdit').value
                    if(content !== ''){
                        const data={
                            content
                        }

                        const responseForEditComment = await fetch(`${getInspWithCons}/comment/${parentId}`,{
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify(data),
                        })
                        const response=await responseForEditComment.json();

                        if(response=='200'){
                            location.reload()
                        }
                    }
                    else{
                        commentElement.querySelector('#childEditCommentError').style.display='block'
                    }

                }
            })
            if(comment.parentId!=null){
                commentElement.querySelector('#subsBtn').style.display='none'
                subComment.appendChild(commentElement)

            }
            else{
                comments.appendChild(commentElement)
            }
        }


        consultList.appendChild(consultElement)
    }
    for(let i=0; i<response.diagnoses.length;i++){
        const diagnos = response.diagnoses[i]
        const diagCard= await fetch ('/DetailsDirectory/diagnosesCardInDetails.html')
        const diagToElement=await diagCard.text()
        let typeDiag
        const type=diagnos.type
        switch (type){
            case 'Main':
                typeDiag='Основной'
                break;
            case 'Concomitant':
                typeDiag='Сопутствующий'
                break;
            case 'Complication':
                typeDiag='Осложнение'
                break;
        }
        const diagElement=document.createElement('div')
        diagElement.innerHTML=diagToElement
        diagElement.querySelector('#mkbDiag').innerHTML+=diagnos.name
        diagElement.querySelector('#typeDiag').innerHTML+=typeDiag
        diagElement.querySelector('#decriptionDiag').innerHTML+=diagnos.description

        Diags.appendChild(diagElement)
    }
}