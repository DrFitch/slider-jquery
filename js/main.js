const CONFIG = {
    // loader
    timeBeforeShowContent: 2000,
    // audio
    audio: 'japanese_rap.mp3',
    autoplay: true,
    // slides
    animation: 'fadeIn',
    timeBetweenSlides: 3000
}

$(document).ready(function () {
    var loading;
    var config;
    var slide_index = 0;
    var play = true;
    var sound = new Howl({
        src: ['./audio/' + CONFIG.audio],
        autoplay: CONFIG.autoplay,
        loop: true,
        volume: 0.5,
        onend: function () {
            console.log('Song ended!');
        }
    });
    var formdata;

    load();

    function load() {
        loading = setTimeout(showPageContent, CONFIG.timeBeforeShowContent);
        getConfig();
    }

    $("#fullscreen").click(function () {
        console.log('fullscreen');
        fullscreen();
    });

    $("#play").click(function () {
        play = true;

        sound.play();
        document.getElementById("play").style.display = "none";
        document.getElementById("pause").style.display = "";

        slidesFunction();
    });

    $("#pause").click(function () {
        play = false;

        sound.pause();
        document.getElementById("pause").style.display = "none";
        document.getElementById("play").style.display = "";

        // we clean all the timeouts to avoid increase of speed in animation
        stopAllTimeouts();
    });

    $("#settings-btn").click(function () {
        onOpenSettings();
    });

    $("#settings-close-btn").click(function () {
        onCloseSettings();
    });

    $("#settings-cancel-btn").click(function () {
        onCloseSettings();
    });

    $('#settings-save-btn').click(function () {
        onSaveSettings();
    });

    $('#drag-save-btn').click(function () {
        uploadFiles();
    });

    onOpenSettings

    function showPageContent() {
        // display page content
        document.getElementById("loader").style.display = "none";
        document.getElementById("page-content").style.display = "block";

        // load slides
        slidesFunction(slide_index);
    }

    function slidesFunction() {

        // in case pause pressed cancel the execution
        if (!play) {
            return;
        }

        $(".slide-content").addClass(CONFIG.animation);

        var i;

        // get all images of slider
        var slides = document.getElementsByClassName("slide-content");

        // get all dots
        var dots = document.getElementsByClassName("dot");

        // hide images
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }

        // disable dots
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }

        // previously initialized to 0
        slide_index++;

        // if index go beyond the pale we "restart" the slider
        if (slide_index > slides.length) { slide_index = 1 }

        slides[slide_index - 1].style.display = "block";
        dots[slide_index - 1].className += " active";

        setTimeout(slidesFunction, CONFIG.timeBetweenSlides); // Look at conf
    }

    function fullscreen() {
        // if already full screen; exit
        // else go fullscreen
        if (
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        ) {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } else {
            element = $('#slide-show').get(0);
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        }
    }

    // allow us to clear all settimeout in activity
    function stopAllTimeouts() {
        var id = window.setTimeout(null, 0);
        while (id--) {
            window.clearTimeout(id);
        }
    }

    function getConfig() {
        $.getJSON('http://localhost:8181/settings', function (data) {
            console.log('settings', data);
            config = data;
            onLoadJson();
        });
    }

    function onOpenSettings() {
        $('#formGroupNomInput').val(config.slideshow.name);
        $('#formGroupTempsInput').val(config.slideshow.delayBetweenSlides);
        $('#inlineFormAnimationSelect').val(config.slideshow.animation);

        config.slideshow.slides.forEach((slide, index) => {
            console.log('slide', slide);
            const index1 = index + 1;
            console.log('index', index);
            var test = $([
                `
                <div class="form-group">
                    <label for="formGroupNomSlide">Slide #${index1}</label>
                    <div class="row">
                        <!-- fichier slide -->
                        <div class="col-3">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="customSlide">
                                <label class="custom-file-label" for="customSlide">Image</label>
                            </div>
                        </div>

                        <!-- animation -->
                        <div class="col-3">
                            <select class="custom-select mr-sm-2" id="inlineFormAnimationSlideSelect${index}">
                                <option selected>Choix animation</option>
                                <option value="fade">Fade</option>
                                <option value="fadeIn">Fade in</option>
                                <option value="swing">Swing</option>
                                <option value="zoom">Zoom</option>
                                <option value="move">Move</option>
                            </select>
                        </div>

                        <div class="col-3">
                            <div class="form-group">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">De</span>
                                    </div>
                                    <input type="text" class="form-control" id="formGroupSlideFromInput${index}" aria-describedby="basic-addon1">
                                </div>
                            </div>
                        </div>
                                
                        <div class="col-3">
                            <div class="form-group">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">A</span>
                                    </div>
                                <input type="text" class="form-control" id="formGroupSlideToInput${index}" aria-describedby="basic-addon1">
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="row">

                        <!-- titre slide -->
                        <div class="col-3">
                            <input type="text" class="form-control" id="formGroupNomSlideInput${index}" placeholder="Ex : Mon image">
                        </div>

                        <!-- animation -->
                        <div class="col-3">
                            <select class="custom-select mr-sm-2" id="inlineFormAnimationTextSelect${index}">
                                <option selected>Choix animation</option>
                                <option value="fade">Fade</option>
                                <option value="fadeIn">Fade in</option>
                                <option value="swing">Swing</option>
                                <option value="zoom">Zoom</option>
                                <option value="move">Move</option>
                            </select>
                        </div>

                        <div class="col-3">
                            <div class="form-group">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">De</span>
                                    </div>
                                    <input type="text" class="form-control" id="formGroupTextFromInput${index}" placeholder="100, 550" aria-describedby="basic-addon1">
                                </div>
                            </div>
                        </div>

                        <div class="col-3">
                            <div class="form-group">
                                <div class="input-group mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="basic-addon1">A</span>
                                    </div>
                                    <input type="text" class="form-control" id="formGroupTextToInput${index}" placeholder="100, 550" aria-describedby="basic-addon1">
                                </div>
                            </div>
                        </div>
                                    
                                    
                    </div>

                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <div class="input-group mb-3">
                                    <input id="formGroupTextColorInput${index}" type="text" class="form-control mycp" aria-describedby="basic-addon"/>
                                    <div class="input-group-append">
                                        <span class="input-group-text" id="basic-addon">Couleur du texte</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-6">
                            <select class="custom-select mr-sm-2" id="inlineFormSizeTextSelect${index}">
                                <option selected>Choix de la taille du titre</option>
                                <option value="8px">8px</option>
                                <option value="10px">10px</option>
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px">16px</option>
                            </select>
                        </div>

                    </div>

                </div>
                `
            ].join("\n"));
            $('#slide-template').append(test);

            $('#formGroupNomSlideInput' + (index)).val(slide.text.content);

            // image
            $('#inlineFormAnimationSlideSelect' + (index)).val(slide.image.animation.type);
            $('#formGroupSlideFromInput' + (index)).val(slide.image.animation.from);
            $('#formGroupSlideToInput' + (index)).val(slide.image.animation.to);
            // text
            $('#inlineFormAnimationTextSelect' + (index)).val(slide.text.animation.type);
            $('#formGroupTextFromInput' + (index)).val(slide.text.animation.from);
            $('#formGroupTextToInput' + (index)).val(slide.text.animation.to);
            $('#inlineFormSizeTextSelect' + (index)).val(slide.text.css.fontSize);
            $('#formGroupTextColorInput' + (index)).val(slide.text.css.color);

            $('.mycp').colorpicker();
        });
    }

    function onLoadJson() {
        config.slideshow.slides.forEach((slide, index) => {
            console.log('slide', slide);
            const index1 = index + 1;
            console.log('index', index);
            var slideContent = $([
                `
                <div class="slide-content">
                    <img class="slide-image" src="${slide.image.URL}">
                    <p class="slide-text">${slide.text.content}</p>
                </div>
                `
            ].join("\n"));
            $('#slide-show').prepend(slideContent);

            var dotContent = $([
                `
                    <span class="dot"></span>
                `
            ].join("\n"));
            $('#dots').append(dotContent);

        });
    }

    function onCloseSettings() {
        $('#slide-template').empty();
    }

    function saveSettings(json) {
        $.ajax
            ({
                type: "POST",
                //the url where you want to sent
                url: 'http://localhost:8181/settings',
                contentType: 'application/json',
                async: false,
                // json object to sent to the authentication url
                data: JSON.stringify(json),
                success: function () {
                    alert("Thanks!");
                }
            })
    }

    function onSaveSettings() {
        let json;
        // general
        let name, delayBetweenSlides, animation, sound;
        // image
        let URL, imageType, imageFrom, imageTo;
        // text
        let content, textType, textFrom, textTo, fontSize, color;

        // generals informations
        name = $('#formGroupNomInput').val();
        delayBetweenSlides = $('#formGroupTempsInput').val();
        animation = $('#inlineFormAnimationSelect').val();

        json = {
            "slideshow": {
                "name": name,
                "delayBetweenSlides": delayBetweenSlides,
                "animation": animation,
                "sound": sound,
                "slides": []
            }
        }

        config.slideshow.slides.forEach((slide, index) => {
            console.log(index);
            // image
            imageType = $('#inlineFormAnimationSlideSelect' + (index)).val();
            imagefrom = $('#formGroupSlideFromInput' + (index)).val();
            imageTo = $('#formGroupSlideToInput' + (index)).val();
            // text
            content = $('#formGroupNomSlideInput' + (index)).val();
            textType = $('#inlineFormAnimationTextSelect' + (index)).val();
            textFrom = $('#formGroupTextFromInput' + (index)).val();
            textTo = $('#formGroupTextToInput' + (index)).val();
            fontSize = $('#inlineFormSizeTextSelect' + (index)).val();
            color = $('#formGroupTextColorInput' + (index)).val();

            json.slideshow.slides.push({
                "image": {
                    "URL": slide.image.URL,
                    "animation": {
                        "type": imageType,
                        "from": imageFrom,
                        "to": imageTo
                    }
                },
                "text": {
                    "content": content,
                    "animation": {
                        "type": textType,
                        "from": textFrom,
                        "to": textTo
                    },
                    "css": {
                        "fontSize": fontSize,
                        "color": color
                    }
                }
            });

            console.log('json', json);
            saveSettings(json);
        });
    }

    function uploadFiles() {
        $.ajax
            ({
                type: "POST",
                //the url where you want to sent
                url: 'http://localhost:8181/upload',
                processData: false,
                contentType: false,
                async: false,
                // json object to sent to the authentication url
                data: formdata,
                success: function () {
                    alert("Thanks!");
                    console.log('formdata', formdata);
                }
            });
    }

    // drag & drop

    $(function () {
        // dragn'drop events
        $(document).on('dragenter', '#dropfile', function () {
            $(this).css('border', '3px dashed red');
            return false;
        });

        $(document).on('dragover', '#dropfile', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).css('border', '3px dashed red');
            return false;
        });

        $(document).on('dragleave', '#dropfile', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $(this).css('border', '3px dashed #BBBBBB');
            return false;
        });

        $(document).on('drop', '#dropfile', function (e) {
            if (e.originalEvent.dataTransfer) {
                if (e.originalEvent.dataTransfer.files.length) {
                    // Stop the propagation of the event
                    e.preventDefault();
                    e.stopPropagation();
                    $(this).css('border', '3px dashed green');
                    // Main function to upload
                    upload(e.originalEvent.dataTransfer.files);
                }
            } else {
                $(this).css('border', '3px dashed #BBBBBB');
            }
            return false;
        });

        $('#file').on("change", function () {
            var files = $(this)[0].files
            upload(files);
        })


        function upload(files) {
            var f = files[0];
            formdata = false;

            if (window.FormData) {
                formdata = new FormData();
            }

            $('#fileHelpId').html(files.length + " fichiers");
            $.each(files, function (i, f) {
                console.log(f);
                // Only process image files.
                if (!f.type.match('image/jpeg')) {
                    alert("The file must be a jpeg image");
                    return false;
                }

                if (formdata) {
                    formdata.append("image", f);
                }

                var reader = new FileReader();
                // When the image is loaded,
                // run handleReaderLoad function
                reader.onload = handleReaderLoad;
                reader.file = f;
                // Read in the image file as a data URL.
                reader.readAsDataURL(f);
            });
        }

        function handleReaderLoad(evt) {
            var file = evt.currentTarget;
            var filename = evt.currentTarget.file.name;

            console.log("handleReaderLoad : " + evt.total);
            var description = $('<li>' + filename + ':' + evt.total + '</li>');
            var image = $('<img />', {
                src: file.result
            });

            $('#fileHelpId').append(description);
            $('#fileHelpId').append(image);
        }

    });


});