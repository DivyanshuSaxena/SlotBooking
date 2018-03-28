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
    });

    $("#adm_log_btn").click(function(){
        var user_text = $("#user_text").val();
        var password = $("#pass_text").val();
        $.ajax({
            type: "POST",
            url: "/entries",
            dataType: "json",
            data:{user_text:user_text,password:password}
        }).done(function(data){
            if(data.authentication==true){
                // Code to display the entries
                $(".admin-login").hide();
                $(".message").hide();
                $(".admin").show();
                var slots = data.slots;
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
                $(".message-text").html("Wrong username or password.Please re-enter.");
            }
        });
    });
    
    $("#log_btn").click(function(){
        user_fn_text = $("#user_fn_text").val();
        user_ln_text = $("#user_ln_text").val();
        id_text = $("#id_text").val().toUpperCase();
        mail_text = $("#mail_text").val();
        mob_text = $("#mob_text").val();
        // console.log(user_fn_text);
        console.log(mob_text);
        var correct = true;
        correct = correct && (/([a-zA-Z])$/.test(user_fn_text) && /([a-zA-Z])$/.test(user_ln_text));
        console.log(correct);
        correct = correct && (/[0-9]{10}/.test(mob_text));
        console.log(correct);
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        correct = correct && re.test(mail_text);
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
                // alert(JSON.stringify(data));
                // Code to display the available slots
                var slots = data.slots;
                for (var i = 0; i < slots.length; i++) {
                    var tr = document.createElement("tr");
                    var td1 = document.createElement("td");
                    td1.append(document.createTextNode(slots[i].time));
                    tr.append(td1);
                    tr.setAttribute("class","book-slot");     
                    $("#avail-slots").append(tr);
                }
            });
        }else{
            $(".message").show();
            $(".message-text").html("Details are incorrect. Please re-enter."); // Proper details to be mentioned here
        }
    });

    $(".book-slot").click(function(){
        var time = $(this).innerHTML();
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
                $(".login").show();
                $(".message").show();
                $(".message-text").html("This slot could not be booked. Please try again.");
            }
        });
    });
});