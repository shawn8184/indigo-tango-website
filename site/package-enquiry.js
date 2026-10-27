(() => {
 const choices = {'kickstart':'AI Kickstart — $495 once','second-brain':'AI Second Brain Setup — $1,950 once','team':'Second Brain for Teams — $2,950 once','workspace-care':'Workspace Care — $295 per month','custom-automation':'Custom automation project','intro':'Free introductory conversation'};
 const choice=choices[new URLSearchParams(window.location.search).get('service')];
 if(!choice)return;
 const subject=document.querySelector('input[name="Subject"]');
 if(subject&&!subject.value)subject.value=choice;
 const note=document.querySelector('#package-enquiry');
 if(note){note.textContent='Your enquiry: '+choice+'. We confirm scope before payment. Sending this form does not purchase a package.';note.hidden=false;}
})();
