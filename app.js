const map = L.map('map').setView([33.738045,  73.084488], 5);
const titleUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(titleUrl);
tiles.addTo(map);


googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleSat.addTo(map);

function generateList() {
    const ul = document.querySelector('.list');
    storeList.forEach((shop) => {
      const li = document.createElement('li');
      const div = document.createElement('div');
      const a = document.createElement('a');
      const p = document.createElement('p');
      a.addEventListener('click', () => {
          flyToStore(shop);
      });
      div.classList.add('shop-item');
      a.innerText = shop.properties.name;
      a.href = '#';
      p.innerText = shop.properties.address;
  
      div.appendChild(a);
      div.appendChild(p);
      li.appendChild(div);
      ul.appendChild(li);
    });
  }
  
  generateList();
  
  function makePopupContent(shop) {
    return `
      <div>
          <h4>${shop.properties.name}</h4>
          <p>${shop.properties.address}</p>
          <div class="phone-number">
              <a href="tel:${shop.properties.phone}">${shop.properties.phone}</a>
          </div>
      </div>
    `;
  }
  function onEachFeature(feature, layer) {
      layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
  }
  
  var myIcon = L.icon({
      iconUrl: 'm1.png',
      iconSize: [55, 55]
  });
  
  const shopsLayer = L.geoJSON(storeList, {
      onEachFeature: onEachFeature,
      pointToLayer: function(feature, latlng) {
          return L.marker(latlng,  { icon: myIcon });
      }
  });
  shopsLayer.addTo(map);
  
  function flyToStore(store) {
      const lat = store.geometry.coordinates[1];
      const lng = store.geometry.coordinates[0];
      map.flyTo([lat, lng], 14, {
          duration: 3
      });
      setTimeout(() => {
          L.popup({closeButton: false, offset: L.point(0, -8)})
          .setLatLng([lat, lng])
          .setContent(makePopupContent(store))
          .openOn(map);
      }, 3000);
  }
  


var baseLayers = {
    "Satelite Map": googleSat,
    "Open Street Map": tiles,
};

var overlays = {
    "Marker": shopsLayer,
};
L.control.layers(baseLayers, overlays).addTo(map);