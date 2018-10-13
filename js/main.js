'use strict';

function initPage() {
    var projs = createProjs();
    renderProjs(projs);
}

function renderProjs(projs) {
    // render projs
    var strHtmls = projs.map(function (proj) {
        return `<div class="col-md-4 col-sm-6 portfolio-item">
                    <a class="portfolio-link" data-toggle="modal" href="#portfolioModal" onclick="renderModal('${proj.id}')">
                        <div class="portfolio-hover">
                        <div class="portfolio-hover-content">
                            <i class="fa fa-plus fa-3x"></i>
                        </div>
                        </div>
                        <img class="img-fluid" src="img/portfolio/${proj.img}" alt="">
                    </a>
                    <div class="portfolio-caption">
                        <h4>${proj.name}</h4>
                        <p class="text-muted">${proj.title}</p>
                    </div>
                </div>`;
    });
    
    // show
    $('#portfolios-container').html(strHtmls.join(''));
}

function renderModal(projId) {
    var proj = getProjById(projId);
    var $modal = $('.portfolio-modal .modal-body');
    $modal.find('h2').text(proj.name);
    $modal.find('.item-intro').text(proj.title);
    $modal.find('.proj-desc').text(proj.desc);
    $modal.find('.proj-date').text(proj.publishedAt);
    $modal.find('img').attr('src', `img/portfolio/${proj.id}.png`);
    $modal.find('iframe').attr('src', `${proj.url}/index.html`);

    var labelsHtmls = proj.labels.map(function (label) {
        return `${label}`;
    })
    $modal.find('.proj-category').text(labelsHtmls.join(', '));
}

function onSubmitForm() {
    // var mail = $('#userEmail').val();
    var subject = $('#mailSubject').val();
    var message = $('#mailMessage').val();
    var page = `https://mail.google.com/mail/?view=cm&fs=1&to=esterpratt@gmail.com&su=${subject}&body=${message}`;
    window.open(page);
}

function openProject() {
    var src = $('.portfolio-modal .modal-body iframe').attr('src');
    window.open(src);
}