/* Globals*/
var sentences = [
    'Bitch better have my money',
    'by Rihanna'
];

var upper,
    lower,
    sentenceCounter = 0,
    characterCounter = 0,
    currentSentence,
    ok,
    remove,
    timestamp = null,
    numberOfMistakes = 0,
    body;

 /*Doc*/   
 /*Keyboard*/

$(document).ready(function() {
    upper = $('#keyboard-upper-container');
    lower = $('#keyboard-lower-container');
    remove = $('#remove');
    ok = $('#ok');
    body = $('body');

    ok.hide();
    remove.hide();
    upper.hide();

    /*Recognize KeyPresses*/

    $(document).on('keyup keydown', function(e) {
        if (timestamp === null) {
            timestamp = new Date().getTime();
        }

        if (e.type === 'keydown' && e.which === 16){
            upper.show();
            lower.hide();
        } else if (e.type === 'keyup' && e.which === 16) {
            upper.hide();
            lower.show();
        }

        var trueCode = e.which;

        if (!e.shiftKey && e.which !== 32) {
            trueCode = e.which + 32;
        }

        if (e.type === 'keydown') {
            $('#' + trueCode).css('background-color', 'pink');
        }

        if (e.type === 'keyup') {
            $('#' + trueCode).css('background-color', '#f5f5f5');
        }

        if (e.type === 'keydown' && trueCode !== 16) {
            if (trueCode === currentSentence.charCodeAt(characterCounter)) {
                handleGlyphicon('ok');

                if (characterCounter === currentSentence.length - 1) {
                    sentenceCounter++;

                    if (sentenceCounter === sentences.length) {
                        var wpm = calculateWpm();
                        var message = wpm < 0 ? 'You dont deserve RiRi' : wpm;

                        if (confirm('Do you want to play again? Your wpm score is: ' + message)) {
                            reset();
                        } else {
                            body.empty();

                            body.css({
                                backgroundColor: 'red',
                                textAlign: 'center',
                                fontFamily: 'Nosifer'
                            });

                            var h1 = $('<h1>She called the shots, and she went brrap brrap brrap</h1>').css('font-size', '15em');
                            body.append(h1);
                        }

                        return;
                    }

                    characterCounter = 0;
                    getSentence();
                } else {
                    characterCounter++;
                }

                highlightCharacter();
                targetCharacter();
            } else {
                numberOfMistakes++;
                handleGlyphicon('remove');
            }
        }
    });

    getSentence();
    highlightCharacter();
    targetCharacter();
});

/*WPM*/

function calculateWpm() {
    var endTimestamp = new Date().getTime();

    var elapsedTime = (endTimestamp - timestamp) / 1000;

    var wordsArray = [];

    sentences.forEach(function(s) {
        wordsArray.push(s.split(' '));
    });

    var flattened = [].concat.apply([], wordsArray);

    var numberOfWords = flattened.length;

    return Math.round(numberOfWords / (elapsedTime / 60) - (2 * numberOfMistakes));
}

/*Reset*/

function reset() {
    characterCounter = 0;
    sentenceCounter = 0;
    numberOfMistakes = 0;
    timestamp = null;
    getSentence();
    highlightCharacter();
    targetCharacter();
    handleGlyphicon(null, true);
}

function handleGlyphicon(type, clear) {
    if (type === 'ok') {
        remove.hide();
        ok.show();
    } else if (type === 'remove') {
        ok.hide();
        remove.show();
    }

    if (clear) {
        ok.hide();
        remove.hide();
    }
}

function getSentence() {
    currentSentence = sentences[sentenceCounter];
    $('#sentence-container').empty();
    var splitSentence = currentSentence.split('');
    splitSentence.forEach(function(character, index) {
        $('#sentence-container').append(`<span id="letter-${index}">${character}</span>`);
    });
}

function highlightCharacter() {
    if (characterCounter !== 0) {
        $('#letter-' + (characterCounter - 1)).css('background-color', 'white');
    }

    $('#letter-' + characterCounter).css('background-color', 'lavender');
}

function targetCharacter() {
    $('#target-letter').empty().append(currentSentence.charAt(characterCounter));
}






