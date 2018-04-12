var socket = io.connect("http://localhost:8002");
var adm_auth=false;
var auth_post=false;
var user_fn_text;
var user_ln_text;
var mail_text;
var id_text;
var mob_text;

socket.on('connect', function(){
    // sessionid = socket.id;
    // console.log(sessionid);
});

$(document).ready(function(){
    console.log("Working");

    $(".admin").hide();
    $(".admin-login").hide();
    $(".slots").hide();
    $(".message").hide();
    $("#show_entries").click(function(){
        $(".login").hide();
        $(".admin-login").show();
        $(".slots").hide();
        $(".message").hide();
        $(".admin").hide();
    });
    $("#user_book").click(function(){
        $(".login").show();  
        $(".admin-login").hide();
        $(".slots").hide();
        $(".message").hide();
        $(".admin").hide(); 
    });

    $("#adm_log_btn").click(function(){
        var user_text = $("#user_text").val();
        var password = $("#pass_text").val();
        console.log("New admin login");
        $(".slots").hide();
        $(".message").hide();
        $(".admin").hide();
        $.ajax({
            type: "POST",
            url: "/entries",
            dataType: "json",
            data:{user_text:user_text,password:password}
        }).done(function(data){
            console.log("Received registered choices");
            if(data.authentication==true){
                // Code to display the entries
                $(".admin-login").hide();
                $(".admin").show();
                var slots = data.slots;
                $("#entries tr").remove();
                var trow = document.createElement("tr");
                var tdout1 = document.createElement("td");
                var tdout2 = document.createElement("td");
                var tdout3 = document.createElement("td");
                var tdout4 = document.createElement("td");
                var tdout5 = document.createElement("td");
                var tdout6 = document.createElement("td");
                tdout1.setAttribute("class","time-slot font-weight-bold");
                tdout2.setAttribute("class","first-name font-weight-bold");
                tdout3.setAttribute("class","last-name font-weight-bold");
                tdout4.setAttribute("class","entry-no font-weight-bold");
                tdout5.setAttribute("class","email-id font-weight-bold");
                tdout6.setAttribute("class","mobile font-weight-bold");
                tdout1.innerHTML = "Time Slot";
                tdout2.innerHTML = "First Name";
                tdout3.innerHTML = "Last Name";
                tdout4.innerHTML = "Entry No.";
                tdout5.innerHTML = "Email Id";
                tdout6.innerHTML = "Contact";
                trow.append(tdout1);
                trow.append(tdout2);
                trow.append(tdout3);
                trow.append(tdout4);
                trow.append(tdout5);
                trow.append(tdout6);
                $("#entries").append(trow);
                for(var i=0;i<slots.length;i++){
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    var td2 = document.createElement("td");
                    var td3 = document.createElement("td");
                    var td4 = document.createElement("td");
                    var td5 = document.createElement("td");
                    var td6 = document.createElement("td");
                    td1.append(document.createTextNode(slots[i].time));
                    td2.append(document.createTextNode(slots[i].first_name));
                    td3.append(document.createTextNode(slots[i].last_name));
                    td4.append(document.createTextNode(slots[i].entry_no));
                    td5.append(document.createTextNode(slots[i].email));
                    td6.append(document.createTextNode(slots[i].mob));
                    tr.append(td1);
                    tr.append(td2);
                    tr.append(td3);
                    tr.append(td4);
                    tr.append(td5);
                    tr.append(td6);
                    $("#entries").append(tr);
                }
            }else{
                $(".admin-login").show();
                $(".message").show();
                $(".message-text").html("Wrong username or password. Please re-enter.");
            }
        });
    });
    
    $("#log_btn").click(function(){
        user_fn_text = $("#user_fn_text").val();
        user_ln_text = $("#user_ln_text").val();
        id_text = $("#id_text").val().toUpperCase();
        mail_text = $("#mail_text").val();
        mob_text = $("#mob_text").val();
        var correct = true;
        correct = correct && (/([a-zA-Z])$/.test(user_fn_text) && /([a-zA-Z])$/.test(user_ln_text));
        console.log(correct);
        correct = correct && mob_text.length==10 && (/([0-9]{10})$/.test(mob_text));
        console.log(correct);
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        correct = correct && re.test(mail_text);
        console.log(correct);
        correct = correct && id_text.length==11 && (/([0-9]{4}[a-zA-Z]{2}[0-9]{5})$/.test(id_text));
        console.log(correct);
        if(correct){
            $(".login").hide();
            $(".message").hide();
            $(".slots").show();
            $.ajax({
                type:"POST",
                url:"/slots",
                dataType:"json",
                data:{}
            }).done(function(data){
                // Code to display the available slots
                console.log("received slots");
                var slots = data.slots;
                console.log(slots);
                // Remove the current rows
                $("#avail-slots tr").remove();
                for (var i = 0; i < slots.length; i++) {
                    var tr = document.createElement("tr");
                    var td = document.createElement("td");
                    td.append(document.createTextNode(slots[i]));
                    tr.append(td);
                    tr.setAttribute("class","book-slot");
                    td.setAttribute("id","book-slot-"+i);
                    td.setAttribute("class","text-center book-slot-d");     
                    $("#avail-slots").append(tr);
                }
            });
        }else{
            $(".message").show();
            $(".message-text").html("Details are incorrect. Please re-enter."); // Proper details to be mentioned here
        }
    });

    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.tagName.toLowerCase() === 'td') {
            // alert(event.target.id);
            console.log("Received user's choice");
            var time = $(event.target).text();
            console.log(time);
            $.ajax({
                type: "POST",
                url: "/user_book",
                dataType: "json",
                data: {time:time,first_name:user_fn_text,last_name:user_ln_text,
                entry_no:id_text,email:mail_text,mob:mob_text}
            }).done(function(data){
                if(data.available==true){
                    $(".message").show();
                    $(".message-text").html("Congrats! Your slot has been booked.");
                }else{
                    $(".message").show();
                    $(".message-text").html("This slot could not be booked. Please try again.");
                }
            });
        }
    });
});