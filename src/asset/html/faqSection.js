const html = `
<div class="cameleon_content section full-page-width pt-xl p-lg pb-xl">
  <div class="cc-wrapper section-content" style="--text-color: var(--secondary-color)">
    <div class="cc-head">
      <div class="">
        <h4 class="title" style="color:white">{{title}}</h4>
      </div>
    </div>
    <div class="cc-blocks">
      {{sectionBlocks}}
      <div class="cc-show_more">
        <div class="cc-show-btn"><span class="cc-show-btn-txt">Show more</span><span class="cc-show-btn-icon"></span></div>
      </div>
    </div>
  </div>
</div>`

export default html