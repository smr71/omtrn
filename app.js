/*

Ideas:

General repeat timer below main panel
Settings to adjust amount of time
When timer runs out, give compulsory action
- If desp value is low, more chance of pee 
- Additional drink, always some chance but decreased as desp rises
- If not pee, random chance of other challenges (lie on stomach, jumping jacks, stand in bathrm)
*/

function now() {
	return Date.now()/60000;
}

let stealthy = false;
let permission = true;

let drinker = new Drinker();

function load_language() {
	let mapping;
	if (stealthy)
		TEXT = STEALTH_TEXT;
	else
		TEXT = NORMAL_TEXT;

	for (let key in TEXT) {
		$("." + key).html(TEXT[key]);
	}
}

function toggle_stealth() {
	stealthy = !stealthy;
	load_language();
	set_permission_text();
	set_eta_message();
}

function set_permission_text() {
	if (permission)
		$('#permMsg').html(TEXT['permissionGranted']);
	else
		$('#permMsg').html(TEXT['permissionDenied']);
}

function set_eta_message() {
	let t = now();
	if (drinker.eta) {
		let msg = TEXT['emergency'] + " ";
		let minutes = Math.ceil(drinker.eta - t);
		if (minutes > 1) {
			msg += TEXT['in'] + " " + minutes + " " + TEXT['timeUnitPlural'];
		}
		else if (minutes == 1) {
			msg += TEXT['in'] + " 1 " + TEXT['timeUnit'];
		} else {
			msg += TEXT['now'] + "!";
		}
		$('#etaMsg').html(msg);
	} else {
		$('#etaMsg').html("&nbsp;");
	}
}

function load_data() {
	let stored_acc = localStorage.getItem("acc");
	if (!stored_acc) {
		console.log("No stored data found.");
		localStorage.setItem("acc", "[]");
	} else {
		drinker.old_acc = JSON.parse(stored_acc);
		console.log("Stored data now loaded:");
		console.log(drinker.old_acc);
	}
}

function reset_capacity() {
	localStorage.setItem("acc", []);
	drinker.old_acc = [];
}

function click_delay(obj) {
	obj.attr("disabled", true);
	setTimeout(function() {
		obj.attr("disabled", false);
	}, 500);
}

function drink() {
	let amount = parseInt($('#drinkVol').text());
	drinker.add_drink(now(), amount);
	$('#totVol').text(drinker.total_drinks);
}

function accident() {
	let amount = drinker.add_release(now(), false);
	let stored_acc = JSON.parse(localStorage.getItem("acc"));
	stored_acc.push(amount);
	localStorage.setItem("acc", JSON.stringify(stored_acc));
}

function ask_permission() {
	$('#permBtn').attr("disabled", true);
	$('#permMsg').css("visibility", "visible");
	permission = drinker.roll_for_permission(now())
	if (permission) {
		$('#doneBtn').css("visibility", "visible");
	}
	set_permission_text();
}

function pee() {
	drinker.add_release(now(), true);
	$('#permBtn').attr("disabled", true);
	$('#doneBtn').css("visibility", "hidden");
	$('#permMsg').css("visibility", "hidden");
}

function poll() {
	let t = now();
	$('#bar').height(Math.floor(100*drinker.desperation(t)) + "%");
	$('#bVol').text(Math.round(drinker.bladder(t)));
	$('#bCap').text(Math.round(drinker.capacity));
	set_eta_message();

	if ($('#permBtn').attr("disabled") && drinker.roll_allowed(t)) {
		$('#permBtn').attr("disabled", false);
		$('#doneBtn').css("visibility", "hidden");
		$('#permMsg').css("visibility", "hidden");
	}
	setTimeout(poll, 1000);
}

$(function() {
	load_data();
	load_language();
	set_permission_text();

	$('#volumeSlider').on("mousemove mousepress change", function() {
		let v = $(this).val();
		$('#drinkVol').text(v);
	});

	$('#drinkBtn').click(function() {
		drink();
		click_delay($(this));
	});


	$('#permBtn').click(function() {
		ask_permission();
	});

	$('#doneBtn').click(function() {
		pee();
	});

	$('#cantBtn').click(function() {
		accident();
		click_delay($(this));
	});

	$('#reset').click(function() {
		let confirmed = confirm(TEXT["resetConfirm"]);
		if (confirmed) {
			reset_capacity();
		}
	});

	$('#toggle').click(function() {
		toggle_stealth();
	});

	poll();

});
