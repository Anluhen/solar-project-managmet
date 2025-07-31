import { getStorageDeliveries, setStorageDeliveries } from '@/utils/storage';

const initialDeliveries = [
  {"id": "1", "date": "21/07/2025", "salesOrder": "51867825", "generator": "18026225", "projectId": "136-2500000-859", "status": 0, "messages": [], "items": [{"id": "1295310485", "description": "Component A", "quantity": "2"}, {"id": "1239670711", "description": "Component B", "quantity": "2"}]},
  {"id": "2", "date": "24/07/2025", "salesOrder": "51719583", "generator": "18709570", "projectId": "136-2500000-858", "status": 1, "messages": [], "items": [{"id": "1957970516", "description": "Component A", "quantity": "5"}, {"id": "1093349856", "description": "Component B", "quantity": "5"}]},
  {"id": "3", "date": "14/07/2025", "salesOrder": "50533224", "generator": "18031244", "projectId": "136-2500000-195", "status": 2, "messages": [], "items": [{"id": "1234760738", "description": "Component A", "quantity": "2"}, {"id": "1542621108", "description": "Component B", "quantity": "5"}]},
  {"id": "4", "date": "01/07/2025", "salesOrder": "59416129", "generator": "18208496", "projectId": "136-2500000-833", "status": 3, "messages": [], "items": [{"id": "1697808098", "description": "Component A", "quantity": "5"}, {"id": "1450455977", "description": "Component B", "quantity": "2"}]},
  {"id": "5", "date": "15/07/2025", "salesOrder": "59886237", "generator": "18291704", "projectId": "136-2500000-928", "status": 4, "messages": [], "items": [{"id": "1933404114", "description": "Component A", "quantity": "1"}, {"id": "1814763202", "description": "Component B", "quantity": "2"}]},
  {"id": "6", "date": "23/07/2025", "salesOrder": "57090293", "generator": "18356778", "projectId": "136-2500000-384", "status": 5, "messages": [], "items": [{"id": "1166944844", "description": "Component A", "quantity": "2"}, {"id": "1819795579", "description": "Component B", "quantity": "3"}]},
  {"id": "7", "date": "04/07/2025", "salesOrder": "51556017", "generator": "18398382", "projectId": "136-2500000-199", "status": 0, "messages": [], "items": [{"id": "1385451171", "description": "Component A", "quantity": "3"}, {"id": "1648245888", "description": "Component B", "quantity": "3"}]},
  {"id": "8", "date": "26/07/2025", "salesOrder": "50728977", "generator": "18765179", "projectId": "136-2500000-570", "status": 1, "messages": [], "items": [{"id": "1575770529", "description": "Component A", "quantity": "1"}, {"id": "1990307112", "description": "Component B", "quantity": "4"}]},
  {"id": "9", "date": "03/07/2025", "salesOrder": "59261704", "generator": "18307419", "projectId": "136-2500000-949", "status": 2, "messages": [], "items": [{"id": "1674996843", "description": "Component A", "quantity": "5"}, {"id": "1950746571", "description": "Component B", "quantity": "3"}]},
  {"id": "10", "date": "19/07/2025", "salesOrder": "53226067", "generator": "18738797", "projectId": "136-2500000-171", "status": 3, "messages": [], "items": [{"id": "1049203558", "description": "Component A", "quantity": "2"}, {"id": "1830075810", "description": "Component B", "quantity": "3"}]},
  {"id": "11", "date": "03/07/2025", "salesOrder": "53905582", "generator": "18908573", "projectId": "136-2500000-203", "status": 4, "messages": [], "items": [{"id": "1408157429", "description": "Component A", "quantity": "3"}, {"id": "1486845604", "description": "Component B", "quantity": "3"}]},
  {"id": "12", "date": "06/07/2025", "salesOrder": "56210606", "generator": "18372528", "projectId": "136-2500000-314", "status": 5, "messages": [], "items": [{"id": "1719595113", "description": "Component A", "quantity": "3"}, {"id": "1753573823", "description": "Component B", "quantity": "1"}]},
  {"id": "13", "date": "20/07/2025", "salesOrder": "52871230", "generator": "18560086", "projectId": "136-2500000-846", "status": 0, "messages": [], "items": [{"id": "1262863730", "description": "Component A", "quantity": "2"}, {"id": "1496348124", "description": "Component B", "quantity": "4"}]},
  {"id": "14", "date": "09/07/2025", "salesOrder": "59344066", "generator": "18230283", "projectId": "136-2500000-801", "status": 1, "messages": [], "items": [{"id": "1348195935", "description": "Component A", "quantity": "1"}, {"id": "1245938494", "description": "Component B", "quantity": "1"}]},
  {"id": "15", "date": "26/07/2025", "salesOrder": "55292423", "generator": "18420651", "projectId": "136-2500000-374", "status": 2, "messages": [], "items": [{"id": "1071069472", "description": "Component A", "quantity": "2"}, {"id": "1980472440", "description": "Component B", "quantity": "5"}]},
  {"id": "16", "date": "29/07/2025", "salesOrder": "55279418", "generator": "18222955", "projectId": "136-2500000-771", "status": 3, "messages": [], "items": [{"id": "1536045484", "description": "Component A", "quantity": "4"}, {"id": "1949921299", "description": "Component B", "quantity": "4"}]},
  {"id": "17", "date": "05/07/2025", "salesOrder": "54443951", "generator": "18146413", "projectId": "136-2500000-352", "status": 4, "messages": [], "items": [{"id": "1799925830", "description": "Component A", "quantity": "5"}, {"id": "1578722458", "description": "Component B", "quantity": "3"}]},
  {"id": "18", "date": "24/07/2025", "salesOrder": "59807725", "generator": "18449245", "projectId": "136-2500000-697", "status": 5, "messages": [], "items": [{"id": "1428853029", "description": "Component A", "quantity": "3"}, {"id": "1235493870", "description": "Component B", "quantity": "2"}]},
  {"id": "19", "date": "17/07/2025", "salesOrder": "58279821", "generator": "18095325", "projectId": "136-2500000-873", "status": 0, "messages": [], "items": [{"id": "1050590821", "description": "Component A", "quantity": "1"}, {"id": "1164112119", "description": "Component B", "quantity": "2"}]},
  {"id": "20", "date": "26/07/2025", "salesOrder": "57082668", "generator": "18625380", "projectId": "136-2500000-165", "status": 1, "messages": [], "items": [{"id": "1413140753", "description": "Component A", "quantity": "4"}, {"id": "1639830322", "description": "Component B", "quantity": "4"}]},
  {"id": "21", "date": "17/07/2025", "salesOrder": "54218028", "generator": "18580099", "projectId": "136-2500000-981", "status": 2, "messages": [], "items": [{"id": "1012327652", "description": "Component A", "quantity": "1"}, {"id": "1731980933", "description": "Component B", "quantity": "5"}]},
  {"id": "22", "date": "25/07/2025", "salesOrder": "54476583", "generator": "18805934", "projectId": "136-2500000-756", "status": 3, "messages": [], "items": [{"id": "1365260635", "description": "Component A", "quantity": "1"}, {"id": "1315143362", "description": "Component B", "quantity": "4"}]},
  {"id": "23", "date": "06/07/2025", "salesOrder": "57612220", "generator": "18003402", "projectId": "136-2500000-839", "status": 4, "messages": [], "items": [{"id": "1940439931", "description": "Component A", "quantity": "3"}, {"id": "1537500247", "description": "Component B", "quantity": "2"}]},
  {"id": "24", "date": "17/07/2025", "salesOrder": "51785277", "generator": "18912804", "projectId": "136-2500000-740", "status": 5, "messages": [], "items": [{"id": "1320452650", "description": "Component A", "quantity": "5"}, {"id": "1653876785", "description": "Component B", "quantity": "2"}]},
  {"id": "25", "date": "05/07/2025", "salesOrder": "56273233", "generator": "18799550", "projectId": "136-2500000-265", "status": 0, "messages": [], "items": [{"id": "1579153816", "description": "Component A", "quantity": "5"}, {"id": "1986224887", "description": "Component B", "quantity": "1"}]},
];

const deliveries = getStorageDeliveries() || initialDeliveries;

// Initialize localStorage if empty
if (!getStorageDeliveries()) {
  setStorageDeliveries(initialDeliveries);
}

export const updateDeliveries = (newDeliveries: any[]) => {
  setStorageDeliveries(newDeliveries);
  return newDeliveries;
};

export default deliveries;