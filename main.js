"use strict";


var ReservationModule = {


	init: function () {

		$('#dateSelection').show();
		$('#roomSelection').hide();
		$('#guestInformation').hide();
		$('#confirmation').hide();

		$(".step-icon-wrapper .step-icon").removeClass('step-icon-current');
		$(".step-icon-wrapper .step-icon").eq(0).addClass('step-icon-current');

		this.reservationSteps.checkInCheckOut.init();

	},

	flowCoordinator: {

		current: 1,

		next: function () {

			this.goToStep(this.current + 1);

		},

		goToStep: function (stepNumber) {

			if (stepNumber <= 4 && stepNumber >= 1) {

				ReservationModule.flowCoordinator.current = stepNumber;

				$('#dateSelection').hide();
				$('#roomSelection').hide();
				$('#guestInformation').hide();
				$('#confirmation').hide();

				switch (this.current) {
					case 1:
						$('#dateSelection').show();
						ReservationModule.reservationSteps.checkInCheckOut.init();
						break;
					case 2:
						$('#roomSelection').show();
						ReservationModule.reservationSteps.selectRoom.init();
						break;
					case 3:
						$('#guestInformation').show();
						break;
					case 4:
						$('#confirmation').show();
						break;
				}

				$(".step-icon-wrapper .step-icon").removeClass('step-icon-current');
				$(".step-icon-wrapper .step-icon").eq(stepNumber - 1).addClass('step-icon-current');


			}
		}

	},

	reservationInfo: {
		checkIn: null,
		checkOut: null,
		rooms: null,
		guests: {

			count: {
				adults: null,
				children: null,
				infants: null,
			},

			info: {
				firstName: '',
				lastName: '',
				email: '',
				tel: '',
				address: {line1: '', line2: '', city: '', stateOrCountry: '', postalCode: ''},
				specialRequirement: ''
			}

		},

		accommodations: [],
	},

	reservationSteps: {


		checkInCheckOut: {

			init: function () {

				var onSelectCommon = function (inst) {

					setTimeout(function () {

						inst.input.find('a').removeClass('selected-date');
						inst.input.find('a').filter(function (id, e) {
							return $(e).html().trim() == inst.selectedDay;
						}).addClass('selected-date');

					}, 50);

				};

				var validation = function (checkIn, checkOut) {

					var checkIn = checkIn || ReservationModule.reservationInfo.checkIn;
					var checkOut = checkOut || ReservationModule.reservationInfo.checkOut;

					if (checkIn && checkOut && checkIn.getTime() > checkOut.getTime()) {
						alert('Check in Date Cannot be greater than check out Date');
						return false;
					}

					return true;
				};

				$("#datepicker1").datepicker({
					minDate: new Date(),
					onSelect: function (dateText, inst) {
						if (validation(new Date(dateText), null)) {
							ReservationModule.reservationInfo.checkIn = new Date(dateText);
							onSelectCommon(inst);
							$('#checkIn').val(dateText);
						}

					}

				});

				$("#datepicker2").datepicker({
					minDate: new Date(),
					onSelect: function (dateText, inst) {
						if (validation(null, new Date(dateText))) {
							ReservationModule.reservationInfo.checkOut = new Date(dateText);
							onSelectCommon(inst);
							$('#checkOut').val(dateText);
						}
					}

				});


				$('#rooms').on('change', function (e) {
					ReservationModule.reservationInfo.rooms = this.value;
				});


				$('#adults').on('change', function (e) {
					ReservationModule.reservationInfo.guests.count.adults = this.value;
				});

				$('#children').on('change', function (e) {
					ReservationModule.reservationInfo.guests.count.children = this.value;
				});

				$('#checkAvailibilityAndNext').click(function () {

					if (validation()) {
						ReservationModule.flowCoordinator.goToStep(2);
					}
				});


			}


		},

		selectRoom: {

			init: function () {

				$('#editReservation').click(function () {
					ReservationModule.flowCoordinator.goToStep(1);
				})
			}

		}

	}


};

ReservationModule.init();