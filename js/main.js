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
                        <img class="img-fluid" src="img/portfolio/${proj.id}.png" alt="">
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
}