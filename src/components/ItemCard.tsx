import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import { Item } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface ItemCardProps {
  item: Item;
}

const ItemCard = ({ item }: ItemCardProps) => {
  return (
    <Link to={`/items/${item.id}`}>
      <div className="card group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={item.images[0]} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Status Badge */}
          {item.status === 'rented' && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
              Currently Rented
            </div>
          )}
          
          {item.status === 'unavailable' && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
              Unavailable
            </div>
          )}
          
          {item.featured && (
            <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded">
              Featured
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <div className="flex justify-between items-center">
              <p className="text-white font-semibold">₹{item.price}/day</p>
              {item.deposit && (
                <p className="text-white/90 text-sm">₹{item.deposit} deposit</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-grow p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.title}</h3>
          
          <div className="flex items-center text-slate-500 text-sm mb-2">
            <MapPin size={14} className="mr-1" />
            <span>{item.location}, {item.city}</span>
          </div>
          
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">{item.description}</p>
          
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-100">
            <div className="flex items-center">
              {item.ownerPhoto ? (
                <img 
                  src={item.ownerPhoto} 
                  alt={item.ownerName} 
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-500 flex items-center justify-center mr-2">
                  {item.ownerName.charAt(0)}
                </div>
              )}
              <span className="text-sm text-slate-600">{item.ownerName}</span>
            </div>
            <div className="text-xs text-slate-500">
              {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;