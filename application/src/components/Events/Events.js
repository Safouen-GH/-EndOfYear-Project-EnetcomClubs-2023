import React from 'react'
import './Events.css'

export const Events = () => {
  return (

    <div id='main'>
        <h3 className='titre'>Join our family by checking out Enetcom's popular events</h3>
    <div id="carouselExampleDark" class="carousel carousel-dark slide container events-container">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active" data-bs-interval="10000">
      <img src="images/events/gtday.jpg" className="d-block_w-100" alt="event image" />
      <div class="carousel-caption d-none d-md-block">
        
      </div>
    </div>
    <div class="carousel-item" data-bs-interval="2000">
      <img src="images/events/SYS.jpg" class="d-block_w-100" alt="event image" />
      <div class="carousel-caption d-none d-md-block">
      
      </div>
    </div>
    <div class="carousel-item">
      <img src="images/events/IDSD.jpg" class="d-block_w-100" alt="event image" />
      <div class="carousel-caption d-none d-md-block">
        
      </div>
    </div>
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
</div>

  )
}
