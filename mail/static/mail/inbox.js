document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => {
        let mes = document.querySelector("#message");
        mes.innerHTML = "";
        mes.style.backgroundColor = "";
        load_mailbox('inbox');
    });
    document.querySelector('#sent').addEventListener('click', () => {
        let mes = document.querySelector("#message");
        mes.innerHTML = "";
        mes.style.backgroundColor = "";
        load_mailbox('sent');
    });
    document.querySelector('#archived').addEventListener('click', () => {
        let mes = document.querySelector("#message");
        mes.innerHTML = "";
        mes.style.backgroundColor = "";
        load_mailbox('archive');
    });
    document.querySelector('#compose').addEventListener('click', () => {
        let mes = document.querySelector("#message");
        mes.innerHTML = "";
        mes.style.backgroundColor = "";
        compose_email();
    });
  
    load_mailbox('inbox');
  });
  
  
  function compose_email() {
  
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#detail-view').style.display = 'none';
  
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  

    document.querySelector('#compose-form').onsubmit = function() {
        send_mail();
        return false;
    }
  };
  
  function load_mailbox(mailbox) {

    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#detail-view').style.display = 'none';
  
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
        if (emails.length > 0) {
            emails.forEach(email => {
                let container = document.createElement('div');
                let p_mail = document.createElement('p');
                let p_subject = document.createElement('p');
                let p_date = document.createElement('p');
    
                container.className = 'parent';
                p_mail.className = 'email';
                p_subject.className = 'subject';
                p_date.className = 'time';
    
                p_mail.innerHTML = `From: ${email["sender"]}`;
                p_subject.innerHTML = `Subject: ${email["subject"]}`;
                p_date.innerHTML = `Time: ${email["timestamp"]}`;
    
                document.querySelector('#emails-view').append(container);
                container.appendChild(p_mail);
                container.appendChild(p_subject);
                container.appendChild(p_date);
    
                container.style.display = "flex";
                container.style.justifyContent = "space-between";
              
                container.style.borderRadius = "20px";
                container.style.border = "4px dashed black";
                container.style.padding = "8px";
                container.style.marginBottom = "20px";
                container.style.fontSize = "20px";
                
                if (email["read"])
                {
                    container.style.backgroundColor = "gray";
                    container.style.fontWeight = "normal";
                }
                else 
                { 
                    container.style.backgroundColor = "white";
                    container.style.fontWeight = "bold";
                }
               
                container.addEventListener("click", function () {
                    get_email(email);
                    fetch(`/emails/${email["id"]}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            read: true
                        })
                    });
                });
            });
        }
        else {
            let mes = document.querySelector("#message");
            mes.innerHTML = "No emails available";
            mes.style.color = "white";
            mes.style.backgroundColor = "black";
            mes.style.textAlign = "center";
            mes.style.paddingTop = '5px';
            mes.style.paddingBottom = '5px';
            mes.style.marginTop = '10px';
            mes.style.borderRadius = '20px';
          
        };
    })
    };
  
  function get_email(email) {

      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';
      document.querySelector('#detail-view').style.display = 'block';
  
      fetch(`/emails/${email["id"]}`)
      .then(response => response.json())
      .then (email => {  
          document.querySelector('.from').innerHTML = `Sender: ${email["sender"]}`;
          document.querySelector('.to').innerHTML = `Recipients: ${email["recipients"]}`;
          document.querySelector('.subject').innerHTML = `Subject: ${email["subject"]}`;
          document.querySelector('.date').innerHTML = `Date: ${email["timestamp"]}`;
          
          if (email["archived"]) 
              document.querySelector('#archive').innerHTML = "Unarchive";
          else
              document.querySelector('#archive').innerHTML = "Archive";
          
          document.querySelector('.text-mail').innerHTML = email["body"];
          document.querySelector('.text-mail').style.marginTop = '30px';
          document.querySelector('.text-mail').style.marginLeft = 'auto';
          document.querySelector('.text-mail').style.marginRight = 'auto';
          document.querySelector('.text-mail').style.padding = '20px';
          document.querySelector('.text-mail').style.width = '100%';
          document.querySelector('.text-mail').style.backgroundColor = 'white';
          document.querySelector('.text-mail').style.border = '2px solid black';
          document.querySelector('.text-mail').style.borderRadius = '10px';
      });

      document.querySelector('#archive').onclick = () => {
          let mes = document.querySelector("#message");
          mes.innerHTML = "";
          mes.style.backgroundColor = "";
          changeArchive(email);
      }
  
      document.querySelector('#reply').onclick = () => {
        let mes = document.querySelector("#message");
        mes.innerHTML = "";
        mes.style.backgroundColor = "";
          reply(email);
      };
  };
  
  function changeArchive(email) {
      fetch(`/emails/${email["id"]}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: !email["archived"]
          })
      }).then(() => load_mailbox('inbox'));
  };
  
  function send_mail() {
        let newRecipients = document.querySelector('#compose-recipients').value;
        let newSubject = document.querySelector('#compose-subject').value;
        let newBody = document.querySelector('#compose-body').value;
        let mes = document.querySelector("#message");

        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: newRecipients,
                subject: newSubject,
                body: newBody,
            })
        }).then(response => response.json())
        .then(show => {
            if (show["error"]) {
                mes.innerHTML = show["error"];
                mes.style.color = "white";
                mes.style.backgroundColor = "red";
                mes.style.textAlign = "center";
                mes.style.paddingTop = '5px';
                mes.style.paddingBottom = '5px';
                mes.style.marginTop = '10px';
                mes.style.borderRadius = '20px';
            }
            else if (show["message"]) {
                mes.innerHTML = show["message"];
                mes.style.color = "black";
                mes.style.backgroundColor = "lightgreen";
                mes.style.textAlign = "center";
                mes.style.paddingTop = '5px';
                mes.style.paddingBottom = '5px';
                mes.style.marginTop = '10px';
                mes.style.borderRadius = '20px';
                load_mailbox('sent');
            }
        })
        return false;    
  }

 

  function reply(email) {
    
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'block';
      document.querySelector('#detail-view').style.display = 'none';  
      document.querySelector('#compose-title').innerHTML = "Reply Email";
      document.querySelector('#compose-body').placeholder = `On ${email["timestamp"]} ${email["sender"]} wrote:\n${email["body"]}`;
      document.querySelector('#compose-recipients').value = email["sender"];
      
      let subjectValue;

      if(email.subject.startsWith('RE: '))
        subjectValue = `${email.subject}`;
      else
        subjectValue = `RE: ${email.subject}`;
    
      document.querySelector('#compose-subject').value = subjectValue;
      document.querySelector('#compose-body').value = '';
  
      document.querySelector('#compose-form').onsubmit = function() {
        send_mail();
        return false;
      }
  }

  function send_mail() {
        let newRecipients = document.querySelector('#compose-recipients').value;
        let newSubject = document.querySelector('#compose-subject').value;
        let newBody = document.querySelector('#compose-body').value;
        let mes = document.querySelector("#message");
        fetch('/emails', {
            method: 'POST',
            body: JSON.stringify({
                recipients: newRecipients,
                subject: newSubject,
                body: newBody,
            })
        }).then(response => response.json())
        .then(show => {
            if (show["error"]) {
                mes.innerHTML = show["error"];
                mes.style.color = "white";
                mes.style.backgroundColor = "red";
                mes.style.textAlign = "center";
                mes.style.paddingTop = '5px';
                mes.style.paddingBottom = '5px';
                mes.style.marginTop = '10px';
                mes.style.borderRadius = '20px';
            }
            else if (show["message"]) {
                mes.innerHTML = show["message"];
                mes.style.color = "black";
                mes.style.backgroundColor = "lightgreen";
                mes.style.textAlign = "center";
                mes.style.paddingTop = '5px';
                mes.style.paddingBottom = '5px';
                mes.style.marginTop = '10px';
                mes.style.borderRadius = '20px';
                load_mailbox('sent');
            }
        }) 
  }