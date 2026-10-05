const heroVehicles = [
  { name: 'Ferrari F8 Tributo', image: 'pexels-danila-rusanov-68267594-9831580.jpg', description: 'Motor V8 biturbo de 3.9 litros. Potencia 720 CV. Torque 770 Nm. Transmisión automática de 7 velocidades con doble embrague.' },
  { name: 'Ferrari California', image: 'pexels-dimkidama-14779980.jpg', description: 'Motor V8 atmosférico de 4.3 litros. Potencia 460 CV. Torque 560 Nm. Transmisión automática de 7 velocidades.' },
  { name: 'Bentley Bentayga', image: 'pexels-owen-outdoors-409204690-29452726.jpg', description: 'Motor 6.0 litros W12 biturbo. Potencia 608 CV. Torque 900 Nm.' },
  { name: 'Lamborghini Aventador S Roadster', image: 'pexels-radu-daniel-mrd-1938968-7391656.jpg', description: 'Motor V12 de 6.5 litros sin turbos. Potencia 740 CV. Torque 690 Nm.' },
  { name: 'Lamborghini Aventador LP 700-4', image: 'pexels-wavyvisuals-377312923-18398374.jpg', description: 'Motor V12 de 6.5 litros aspirado. Potencia 700 CV. Torque 690 Nm.' }
];

export const vehicles = [
  ['Ferrari F8 Tributo', '$320,000', '2022', 'pexels-anewevisual-6891809.jpg'],
  ['Ferrari California', '$195,000', '2021', 'pexels-aymerik-grenier-759296371-30318531.jpg'],
  ['Lamborghini Aventador', '$460,000', '2023', 'pexels-bylukemiller-32725749.jpg'],
  ['Bentley Bentayga', '$245,000', '2024', 'pexels-esase-2151653112-36629227.jpg'],
  ['Porsche 911 Turbo', '$210,000', '2023', 'pexels-framesbyambro-14487952.jpg'],
  ['McLaren 720S', '$295,000', '2022', 'pexels-godric-20706243.jpg'],
  ['Mercedes-AMG GT', '$180,000', '2024', 'pexels-joaquin-delgado-497073239-35656683.jpg'],
  ['BMW M4 Competition', '$115,000', '2023', 'pexels-joaquin-delgado-497073239-35671908.jpg'],
  ['Audi R8 V10', '$205,000', '2022', 'pexels-mikebirdy-16716107.jpg'],
  ['Tesla Model S Plaid', '$105,000', '2024', 'pexels-mikebirdy-18829087.jpg'],
  ['Aston Martin DB11', '$220,000', '2021', 'pexels-mikebirdy-241316.jpg'],
  ['Lamborghini Urus', '$275,000', '2023', 'pexels-vargaphotography-20412127.jpg']
].map(([name, price, year, image]) => ({ name, price, year, image }));

export const branches = [
  ['Caracas Centro', 'Av. Urdaneta, Esq. El Conde', '+58 212 555 0101', '10.4932,-66.8539'],
  ['El Rosal', 'Av. Francisco de Miranda, Torre Polar', '+58 212 555 0202', '10.4900,-66.8653'],
  ['La Castellana', 'Av. Principal de La Castellana', '+58 212 555 0303', '10.4814,-66.8815'],
  ['Chacao', 'Av. Francisco de Miranda, C.C. Sambil', '+58 212 555 0404', '10.5000,-66.8487'],
  ['Las Mercedes', 'Av. Principal de Las Mercedes', '+58 212 555 0505', '10.4968,-66.8069'],
  ['El Hatillo', 'Av. El Parque, Centro Comercial', '+58 212 555 0606', '10.4559,-66.8420']
].map(([name, address, phone, coordinates], index) => ({ name, address, phone, coordinates, id: index + 1 }));

export function homeController(request, response) {
  response.render('index', { heroVehicles, vehicles, branches });
}
