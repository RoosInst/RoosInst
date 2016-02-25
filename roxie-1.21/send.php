<?php
if(isset($_POST['name']) && isset($_POST['email']) && isset($_POST['message'])) {
	require("lib/class.phpmailer.php"); //you have to download this plugin from github.com - link is in documentation
	
	$name = 	$_POST['name'];
	$email = 	$_POST['email'];
	$message = 	$_POST['message'];
	
	$mail = new PHPMailer();
	
	$mail->From = $email;
	$mail->CharSet = "UTF-8";
	$mail->FromName = $email;
	$mail->addAddress("youremail@email.com"); 
	
	$mail->IsHTML(true);
	$mail->Subject = $name." sent you an email";
	
	$mail->Body = $message."<br><br>".$name."<br>".$email."<br>";

	$mail->send();
}
?>   
            